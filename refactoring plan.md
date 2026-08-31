# Refactoring Plan: Svelte Security Optimization

## 1. Executive Summary
Following a comprehensive static application security testing (SAST) and code quality review of the Svelte/SvelteKit codebase, several vulnerabilities and implementation gaps were identified. The codebase overall has a clean architecture (particularly using Svelte 5 runes and context-based state management safely), but critical issues in authentication state storage, credentials handling, email construction, and server-side input validation pose significant security risks.

### Vulnerability Summary
* **Critical/High Severity:** 3 issues
* **Medium Severity:** 2 issues
* **Low Severity:** 1 issue

Overall, the risk posture is **High** due to the leakage of the master administrative password in session cookies, plaintext console logging of sensitive variables, and susceptibility to HTML injection in outgoing email notifications. Applying the refactoring actions detailed in this document will secure the application while preserving all business logic and reactivity.

---

## 2. Vulnerability Breakdown & Remediation

### [ID-001]: Plaintext Administrative Secret Key Stored in Session Cookies (`sid`)
- **Severity:** Critical
- **Target File(s):** `src/hooks.server.js`, `src/routes/login/+page.server.js`
- **The Risk:** The administrator password/secret key (`ADMIN_SECRET_KEY`) is stored directly as the value of the `sid` cookie in the user's browser. While the cookie is set to `httpOnly: true`, storing the master secret key inside the client's cookie jar increases its exposure. If a local system is compromised, or if local debug logs/network proxies capture cookies, the master key is leaked. If the key is rotated on the server, existing sessions are invalidated, but if the key is leaked, the entire system is permanently compromised.
- **Original Code:**
  * **In `src/routes/login/+page.server.js`:**
    ```javascript
    if (password === adminSecret) {
      cookies.set('sid', adminSecret, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      throw redirect(303, '/projects');
    }
    ```
  * **In `src/hooks.server.js`:**
    ```javascript
    const sid = event.cookies.get('sid');
    if (adminSecret && sid && sid === adminSecret) {
      event.locals.isAdmin = true;
    }
    ```
- **Refactored Code:**
  * **In `src/routes/login/+page.server.js`:**
    ```javascript
    import { redirect } from '@sveltejs/kit';
    import { ADMIN_SECRET_KEY } from '$env/static/private';
    import { dev } from '$app/environment';
    import crypto from 'crypto';

    /** @type {import('./$types').Actions} */
    export const actions = {
      default: async ({ cookies, request }) => {
        const data = await request.formData();
        const password = data.get('password');
        const adminSecret = ADMIN_SECRET_KEY;

        if (!adminSecret) {
          return {
            error: 'Admin authentication is not configured on the server.'
          };
        }

        if (password === adminSecret) {
          // Generate a stateless, signed session token: "admin:<expires_timestamp>.<signature>"
          const expires = Date.now() + 60 * 60 * 24 * 7 * 1000; // 1 week
          const sessionValue = `admin:${expires}`;
          const signature = crypto
            .createHmac('sha256', adminSecret)
            .update(sessionValue)
            .digest('hex');
          const sessionToken = `${sessionValue}.${signature}`;

          cookies.set('sid', sessionToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: !dev,
            maxAge: 60 * 60 * 24 * 7 // 1 week
          });
          throw redirect(303, '/projects');
        }

        return {
          error: 'Invalid password'
        };
      }
    };
    ```
  * **In `src/hooks.server.js`:**
    ```javascript
    import { redirect } from '@sveltejs/kit';
    import { ADMIN_SECRET_KEY } from '$env/static/private';
    import crypto from 'crypto';

    /** @type {import('@sveltejs/kit').Handle} */
    export async function handle({ event, resolve }) {
      const adminSecret = ADMIN_SECRET_KEY;
      event.locals.isAdmin = false;

      // Logout logic
      if (event.url.pathname === '/logout') {
        event.cookies.delete('sid', { path: '/' });
        throw redirect(303, '/');
      }

      // Check for the session cookie on every request
      const sid = event.cookies.get('sid');
      if (adminSecret && sid) {
        const parts = sid.split('.');
        if (parts.length === 2) {
          const [sessionValue, signature] = parts;
          const expectedSignature = crypto
            .createHmac('sha256', adminSecret)
            .update(sessionValue)
            .digest('hex');

          // Timing-safe comparison to prevent timing attacks
          const sigBuf = Buffer.from(signature);
          const expSigBuf = Buffer.from(expectedSignature);
          if (
            sigBuf.length === expSigBuf.length &&
            crypto.timingSafeEqual(sigBuf, expSigBuf)
          ) {
            const [role, expiresStr] = sessionValue.split(':');
            const expires = parseInt(expiresStr, 10);
            if (role === 'admin' && expires > Date.now()) {
              event.locals.isAdmin = true;
            }
          }
        }
      }

      if ((event.url.pathname.startsWith('/projects/new') || event.url.pathname.startsWith('/dashboard')) && !event.locals.isAdmin) {
        throw redirect(303, '/login');
      }

      const response = await resolve(event);
      return response;
    }
    ```
- **Functionality Preservation Notes:** Uses stateless cookie cryptography which requires no database schema changes, maintaining the 1-week expiration and full compatibility with existing redirects. It also introduces `crypto.timingSafeEqual` to prevent timing attacks.

---

### [ID-002]: Sensitive Credentials Logged in Plaintext
- **Severity:** High
- **Target File(s):** `src/routes/login/+page.server.js`
- **The Risk:** During login attempts, the entered password and the system's `ADMIN_SECRET_KEY` are printed directly to standard output/logs. If logs are collected in central logging pipelines (Sentry, ELK, Datadog), this exposes administrative credentials to logging systems, violating security standards (e.g. PCI-DSS, OWASP).
- **Original Code:**
  ```javascript
  const password = data.get('password');
  console.log('Password entered by user:', password);

  const adminSecret = process.env.ADMIN_SECRET_KEY;
  console.log('adminSecret from env:', adminSecret);
  ```
- **Refactored Code:**
  ```javascript
  const password = data.get('password');
  const adminSecret = ADMIN_SECRET_KEY; // Read from private environment variables
  ```
- **Functionality Preservation Notes:** Removes plaintext logging entirely. Authentication logic is preserved unchanged.

---

### [ID-003]: HTML / CSS Template Injection in Nodemailer Templates
- **Severity:** High
- **Target File(s):** `src/lib/services/email/nodemailer.ts`
- **The Risk:** Dynamic inputs like `clientName` and `projectTitle` are concatenated directly into the HTML body of outgoing emails without escaping. Attackers who submit consultation requests can write malicious HTML inside the project name or client name inputs to perform phishing, content defacement, or styling overrides in client and admin email clients.
- **Original Code:**
  ```javascript
  const serviceTypeStr = readableLabels[serviceType] || serviceType || 'Website Development';
  const projectTitleStr = `${projectTitle || 'Project'} (${serviceTypeStr})`;
  // ...
  const emailHtml = `
    ...
    Hi ${clientName}, your project consultation session has been successfully locked in.
    ...
    <span style="font-size: 15px; font-weight: 600; color: #ffffff; display: block; margin-top: 4px;">${projectTitleStr}</span>
    ...
    <a href="${meetLink}" target="_blank" ...>Enter Google Meet Space</a>
  `;
  ```
- **Refactored Code:**
  ```typescript
  import nodemailer from 'nodemailer';
  import type { IEmailService } from './interface';

  // HTML Escaping Utility
  function escapeHtml(str: string | number | null | undefined): string {
    if (str === null || str === undefined) return '';
    const s = String(str);
    return s.replace(/[&<>"']/g, (match) => {
      switch (match) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return match;
      }
    });
  }

  // URL Sanitizer (Defense against javascript: schema links)
  function sanitizeUrl(url: string | null | undefined): string {
    if (!url) return '';
    const cleanUrl = url.trim();
    if (cleanUrl.toLowerCase().startsWith('javascript:') || cleanUrl.toLowerCase().startsWith('data:')) {
      return 'about:blank';
    }
    return escapeHtml(cleanUrl);
  }

  // Inside NodemailerEmailService class, escape dynamic variables before embedding:
  async sendMeetingConfirmation(
    to: string,
    clientName: string,
    projectTitle: string,
    serviceType: string,
    projectTier: string,
    targetTimeline: string,
    meetLink: string,
    meetDate: string,
    meetTime: string
  ): Promise<void> {
    const serviceTypeStr = readableLabels[serviceType] || serviceType || 'Website Development';
    const projectTitleStr = `${projectTitle || 'Project'} (${serviceTypeStr})`;
    
    const formattedDate = new Date(meetDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const servicePackage = readableLabels[projectTier] || projectTier || 'Basic MVP';

    const emailHtml = `...
      Hi ${escapeHtml(clientName)}, your project consultation session has been successfully locked in.
      ...
      <span style="font-size: 15px; font-weight: 600; color: #ffffff; display: block; margin-top: 4px;">${escapeHtml(projectTitleStr)}</span>
      ...
      <td class="stack-column" valign="top" width="48%">
        <span style="font-size: 11px; color: #71717a; text-transform: uppercase;">Consultation Date</span>
        <span style="font-size: 13px; font-weight: 500; color: #e4e4e7; display: block;">${escapeHtml(formattedDate)}</span>
      </td>
      ...
      <a href="${sanitizeUrl(meetLink)}" target="_blank" ...>Enter Google Meet Space</a>
    ...`;

    await this.sendMail(to, "Your Consultation Session is Confirmed", emailHtml);
  }

  // Apply escapeHtml and sanitizeUrl to all variables inside sendProposalEmail, sendProgressUpdateEmail, sendSignOffRequestEmail, and sendHandoverPackageEmail
  ```
- **Functionality Preservation Notes:** Cleanly escapes HTML characters (`<`, `>`, `&`, `"`, `'`) and blocks dangerous URI protocols, guaranteeing that valid user data renders properly without rendering as HTML tags.

---

### [ID-004]: Verbose Exception & Stack Trace Exposure on Client-Side Developer Console
- **Severity:** Medium
- **Target File(s):** `src/hooks.client.js`, `src/lib/services/logger.ts`
- **The Risk:** Unhandled errors caught in `hooks.client.js` call `TelemetryLogger.logError()`. The logger stringifies the entire error stack trace, route, and details, printing them to the client console via `console.error('[TELEMETRY_ERROR]', JSON.stringify(logData, null, 2))`. Doping detailed stack traces and file paths exposes application internals, code structure, and bundler configurations to anyone inspecting client logs.
- **Original Code:**
  ```typescript
  const logData = {
    message: errObj.message,
    stack: errObj.stack,
    route: context?.route || (typeof window !== 'undefined' ? window.location.pathname : 'server-context'),
    payload: sanitizedPayload,
    timestamp: new Date().toISOString()
  };

  // Centralized logging endpoint / Sentry pipeline mock
  console.error('[TELEMETRY_ERROR]', JSON.stringify(logData, null, 2));
  ```
- **Refactored Code:**
  ```typescript
  const logData = {
    message: errObj.message,
    stack: errObj.stack,
    route: context?.route || (typeof window !== 'undefined' ? window.location.pathname : 'server-context'),
    payload: sanitizedPayload,
    timestamp: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    // Client-side: Log normal error object for local debugging (safely mapped by devtools)
    // but avoid dumping JSON-formatted stack traces or detailed telemetry payloads in the public console.
    console.error('[Application Error]', errObj.message);
  } else {
    // Server-side: Safe to log the detailed structured telemetry JSON to server stderr
    console.error('[TELEMETRY_ERROR]', JSON.stringify(logData, null, 2));
  }
  ```
- **Functionality Preservation Notes:** The UI still returns the safe fallback message to the user, and client-side stack traces are no longer exposed in clean JSON blocks.

---

### [ID-005]: Insecure Environment Variable Loading and dotenv imports in Shared Client-Side Modules
- **Severity:** Medium
- **Target File(s):** `src/lib/index.js`
- **The Risk:** `src/lib/index.js` acts as the entry point for the `$lib` directory. It imports Node-specific modules like `dotenv/config` directly. If this file is resolved or bundled in any client-side file, it causes bundler warning, potential bloat, and runtime crashes on the client (e.g. `dotenv` requiring `fs` or `path`). It also uses `process.env` which is not defined on the client.
- **Original Code:**
  ```javascript
  import 'dotenv/config'; // Ensure environment variables are loaded
  import { initializeApp, getApp, getApps } from "firebase/app";
  import { getAnalytics } from "firebase/analytics";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
  };

  // Initialize Firebase
  export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  ```
- **Refactored Code:**
  * Move Firebase initialization directly to `src/lib/services/db/firestore.ts` and use SvelteKit's private environment variables module `$env/static/private`. This removes Firebase initialization from `src/lib/index.js` completely, keeping it clean and safe for frontend modules.
  * **In `src/lib/services/db/firestore.ts`:**
    ```typescript
    import { initializeApp, getApp, getApps } from 'firebase/app';
    import { 
      VITE_FIREBASE_API_KEY,
      VITE_FIREBASE_AUTH_DOMAIN,
      VITE_FIREBASE_PROJECT_ID,
      VITE_FIREBASE_STORAGE_BUCKET,
      VITE_FIREBASE_MESSAGING_SENDER_ID,
      VITE_FIREBASE_APP_ID,
      VITE_FIREBASE_MEASUREMENT_ID
    } from '$env/static/private';
    import { 
      getFirestore, 
      collection, 
      getDocs, 
      getDoc, 
      query, 
      orderBy, 
      where, 
      doc, 
      addDoc, 
      updateDoc, 
      deleteDoc 
    } from 'firebase/firestore';
    import type { IDatabaseService, Project, Consultation, Meeting } from './interface';

    const firebaseConfig = {
      apiKey: VITE_FIREBASE_API_KEY,
      authDomain: VITE_FIREBASE_AUTH_DOMAIN,
      projectId: VITE_FIREBASE_PROJECT_ID,
      storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: VITE_FIREBASE_APP_ID,
      measurementId: VITE_FIREBASE_MEASUREMENT_ID
    };

    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const db = getFirestore(app);

    export class FirestoreDatabaseService implements IDatabaseService {
      // ... same implementation
    }
    ```
  * **In `src/lib/index.js`:**
    ```javascript
    // Place files you want to import through the `$lib` alias in this folder.
    // Cleared Firebase initialization and environment variables imports to avoid client bundling conflicts.
    ```
- **Functionality Preservation Notes:** Keeps Firebase initialized only where it's used (on the server), preventing the import of `dotenv` or secret keys on the frontend.

---

### [ID-006]: Lack of Server-Side Input Validation in Admin Dashboard actions
- **Severity:** Low
- **Target File(s):** `src/routes/dashboard/+page.server.js`, `src/routes/dashboard/[id]/+page.server.js`
- **The Risk:** Actions on the admin dashboard page extract text and link values directly from `request.formData()` and pass them to Firestore `dbService` without validating them against schemas. Admins or malicious accounts could post malformed payloads, leading to DB pollution, crashes on client UI rendering (e.g. if the image or URL fields are invalid strings), or stored HTML/XSS injection.
- **Original Code:**
  ```javascript
  const title = data.get('title')?.toString() || '';
  const tagline = data.get('tagline')?.toString() || '';
  // ...
  const projectData = { title, tagline, ... };
  await dbService.createProject(projectData);
  ```
- **Refactored Code:**
  * Validate using schemas before inserting or updating:
  * **In `src/routes/dashboard/+page.server.js`:**
    ```javascript
    import { z } from 'zod';
    import { fail } from '@sveltejs/kit';

    const ProjectFormSchema = z.object({
      title: z.string().min(3),
      tagline: z.string().min(10),
      description: z.string().min(20),
      role: z.string().min(2),
      timeline: z.string().min(1),
      status: z.enum(['In Progress', 'Completed']),
      imageUrl: z.string().url(),
      liveLink: z.string().url().optional().or(z.literal('')),
      githubLink: z.string().url().optional().or(z.literal(''))
    });

    // Inside createProject and updateProject actions:
    const title = data.get('title')?.toString() || '';
    // ...
    const parseResult = ProjectFormSchema.safeParse({
      title, tagline, description, role, timeline, status, imageUrl, liveLink, githubLink
    });

    if (!parseResult.success) {
      return fail(400, { error: 'Format data project tidak valid.' });
    }
    ```
- **Functionality Preservation Notes:** Ensures database consistency and integrity. Prevents malformed inputs from breaking dashboard client components.

---

## 3. Implementation Roadmap

To apply these security improvements smoothly, implement the refactoring steps in the following order:

1. **Step 1 (Critical): Remediate Cookie & Log Session Leak (ID-001 & ID-002)**
   * Replace `process.env.ADMIN_SECRET_KEY` usage with SvelteKit's private environment variables.
   * Modify the login flow and hooks to use the stateless signed token schema.
   * Delete console logs displaying passwords.
   * *Verify:* Admin dashboard access, login, and logout work correctly.

2. **Step 2 (High): Sanitize and Secure Email Output Templates (ID-003)**
   * Implement the `escapeHtml` and `sanitizeUrl` utility functions in `src/lib/services/email/nodemailer.ts`.
   * Apply sanitization to all dynamic fields in email templates.
   * *Verify:* Test email delivery flows; try placing a project name with `<script>` tags and verify it is rendered as text, not HTML.

3. **Step 3 (Medium): Secure Environment Variables & Telemetry Logs (ID-004 & ID-005)**
   * Refactor Firebase client SDK configuration out of `$lib` entry point and into Firestore DB service.
   * Verify environment variables are resolved via SvelteKit private env.
   * Modify telemetry logs to suppress detailed console outputs on client-side errors.
   * *Verify:* Re-build the application to verify no bundling errors occur.

4. **Step 4 (Low): Harden Server Actions Inputs (ID-006)**
   * Integrate Zod validation inside `src/routes/dashboard/+page.server.js` actions.
   * *Verify:* Ensure admin project creation and updates from the dashboard continue to save correctly.
