import nodemailer from 'nodemailer';
import type { IEmailService } from './interface';

const readableLabels: Record<string, string> = {
  web_service: "Website Development",
  mobile_service: "Mobile App Development",
  basic: "Basic MVP",
  intermediate: "Intermediate Custom Website",
  industrial: "Industrial / Enterprise",
  under_1_month: "Under 1 Month",
  "1_to_3_months": "1 – 3 Months",
  "3_to_6_months": "3 - 6 Months Goal",
  flexible: "Flexible"
};

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

// URL Sanitizer to prevent injection of javascript: or data: URIs
function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return '';
  const cleanUrl = url.trim();
  if (cleanUrl.toLowerCase().startsWith('javascript:') || cleanUrl.toLowerCase().startsWith('data:')) {
    return 'about:blank';
  }
  return escapeHtml(cleanUrl);
}

export class NodemailerEmailService implements IEmailService {
  private getTransporter() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    });
  }

  private async sendMail(to: string, subject: string, html: string): Promise<void> {
    const user = process.env.SMTP_USER || '';
    const pass = process.env.SMTP_PASS || '';

    if (!user || !pass) {
      console.log("=== MOCK EMAIL SENDING ===");
      console.log("To:", to);
      console.log("Subject:", subject);
      console.log("Mock Mode Active. Email details printed in terminal.");
      console.log("==========================");
      return;
    }

    const transporter = this.getTransporter();
    await transporter.sendMail({
      from: `"HA Agency" <${user}>`,
      to,
      subject,
      html
    });
  }

  async sendOrderSubmissionEmail(
    to: string,
    clientName: string,
    projectTitle: string,
    serviceType: string,
    projectTier: string,
    consultationDate: string,
    consultationTime: string,
    projectId: string,
    trackingUrl: string
  ): Promise<void> {
    const serviceTypeStr = readableLabels[serviceType] || serviceType || 'Website Development';
    const projectTitleStr = projectTitle ? `${projectTitle} (${serviceTypeStr})` : serviceTypeStr;
    const servicePackage = readableLabels[projectTier] || projectTier || 'Basic MVP';

    let formattedDate = 'Akan Dikonfirmasi';
    if (consultationDate) {
      try {
        formattedDate = new Date(consultationDate).toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        formattedDate = consultationDate;
      }
    }

    const emailHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Project Consultation & Tracking Confirmation</title>
  <style type="text/css">
    #outlook a { padding:0; }
    body { width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0; background-color: #09090b; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
    table { border-collapse: collapse; }
    img { outline:none; text-decoration:none; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 16px !important; }
      .stack-column { display: block !important; width: 100% !important; }
      .column-gap { height: 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 40px 0; background-color: #09090b;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td align="center">
        <table class="email-container" cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #09090b; border: 1px solid #18181b; border-radius: 16px; text-align: left;">
          <tr>
            <td style="padding: 32px 40px; border-bottom: 1px solid #18181b;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td><span style="background-color: #18181b; border: 1px solid #27272a; color: #ffffff; font-weight: 700; font-size: 14px; padding: 8px 12px; border-radius: 6px;">HA</span></td>
                  <td align="right" style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #10b981; font-weight: 600;">Request Received</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 40px 24px 40px;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">Permintaan Proyek Anda Telah Diterima.</h1>
              <p style="margin: 12px 0 0 0; font-size: 14px; color: #a1a1aa; line-height: 1.6;">
                Halo <strong>${escapeHtml(clientName)}</strong>, terima kasih telah mempercayakan proyek Anda kepada kami. Briefing dan jadwal konsultasi awal Anda telah tersimpan dengan aman.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 24px 40px;">
              <!-- Project Summary Card -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 24px;">
                <tr>
                  <td>
                    <span style="font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Rincian Proyek</span>
                    <span style="font-size: 16px; font-weight: 600; color: #ffffff; display: block; margin-top: 4px; margin-bottom: 16px;">${escapeHtml(projectTitleStr)}</span>
                    
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td class="stack-column" valign="top" width="48%">
                          <span style="font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Paket Layanan</span>
                          <span style="font-size: 13px; font-weight: 500; color: #e4e4e7; display: block; margin-top: 2px;">${escapeHtml(servicePackage)}</span>
                        </td>
                        <td class="column-gap" width="4%"></td>
                        <td class="stack-column" valign="top" width="48%">
                          <span style="font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Jadwal Konsultasi</span>
                          <span style="font-size: 13px; font-weight: 500; color: #e4e4e7; display: block; margin-top: 2px;">${escapeHtml(formattedDate)} ${consultationTime ? `(${escapeHtml(consultationTime)})` : ''}</span>
                        </td>
                      </tr>
                    </table>

                    <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #27272a;">
                      <span style="font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; display: block;">Project Tracking ID</span>
                      <span style="font-family: monospace; font-size: 14px; font-weight: 700; color: #60a5fa; background-color: #09090b; border: 1px solid #27272a; padding: 6px 10px; border-radius: 6px; display: inline-block; margin-top: 6px;">${escapeHtml(projectId)}</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 32px 40px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${sanitizeUrl(trackingUrl)}" target="_blank" style="display: block; background-color: #ffffff; color: #09090b; font-weight: 700; font-size: 14px; text-decoration: none; padding: 14px; border-radius: 8px; text-align: center;">Lacak Status Proyek Real-Time</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 16px 0 0 0; font-size: 12px; color: #71717a; text-align: center; line-height: 1.5;">
                Simpan email ini atau Project Tracking ID di atas untuk memantau linimasa, link staging, dan dokumen penawaran kapan saja melalui menu <strong>Track Project</strong> di website kami.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await this.sendMail(to, `Konfirmasi Pengajuan Proyek: ${projectTitle || 'HA Agency Consultation'}`, emailHtml);
  }

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

    const emailHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Consultation Session is Confirmed</title>
  <style type="text/css">
    #outlook a { padding:0; }
    body { width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0; background-color: #09090b; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
    table { border-collapse: collapse; }
    img { outline:none; text-decoration:none; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 16px !important; }
      .stack-column { display: block !important; width: 100% !important; }
      .column-gap { height: 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 40px 0; background-color: #09090b;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td align="center">
        <table class="email-container" cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #09090b; border: 1px solid #18181b; border-radius: 16px; text-align: left;">
          <tr>
            <td style="padding: 40px; border-bottom: 1px solid #18181b;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td><span style="background-color: #18181b; border: 1px solid #27272a; color: #ffffff; font-weight: 600; font-size: 14px; padding: 8px 12px; border-radius: 6px;">HA</span></td>
                  <td align="right" style="font-size: 11px; text-transform: uppercase; color: #71717a;">Consultation Confirmed</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 40px 32px 40px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">Let's build something<br />exceptional together.</h1>
              <p style="margin: 12px 0 0 0; font-size: 14px; color: #a1a1aa; line-height: 1.6;">
                Hi ${escapeHtml(clientName)}, your project consultation session has been successfully locked in.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 24px;">
                <tr>
                  <td>
                    <span style="font-size: 11px; color: #71717a; text-transform: uppercase;">Proposed Project</span>
                    <span style="font-size: 15px; font-weight: 600; color: #ffffff; display: block; margin-top: 4px;">${escapeHtml(projectTitleStr)}</span>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 16px;">
                      <tr>
                        <td class="stack-column" valign="top" width="48%">
                          <span style="font-size: 11px; color: #71717a; text-transform: uppercase;">Consultation Date</span>
                          <span style="font-size: 13px; font-weight: 500; color: #e4e4e7; display: block;">${escapeHtml(formattedDate)}</span>
                        </td>
                        <td class="column-gap" width="4%"></td>
                        <td class="stack-column" valign="top" width="48%">
                          <span style="font-size: 11px; color: #71717a; text-transform: uppercase;">Service Package</span>
                          <span style="font-size: 13px; font-weight: 500; color: #e4e4e7; display: block;">${escapeHtml(servicePackage)}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 24px 40px 32px 40px;">
              <a href="${sanitizeUrl(meetLink)}" target="_blank" style="display: block; background-color: #ffffff; color: #09090b; font-weight: 600; font-size: 14px; text-decoration: none; padding: 14px; border-radius: 8px; text-align: center;">Enter Google Meet Space</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await this.sendMail(to, "Your Consultation Session is Confirmed", emailHtml);
  }

  async sendProposalEmail(
    to: string,
    clientName: string,
    projectTitle: string,
    quotedPrice: number,
    downPaymentRequirement: string,
    proposalUrl: string
  ): Promise<void> {
    const emailHtml = `<div style="background-color: #09090b; color: #ffffff; padding: 40px; font-family: sans-serif; border-radius: 16px;">
      <h2>Project Proposal & Quotation Prepared</h2>
      <p>Hi ${escapeHtml(clientName)},</p>
      <p>We have finalized the proposal and quotation details for <strong>${escapeHtml(projectTitle)}</strong>.</p>
      <div style="background-color: #18181b; border: 1px solid #27272a; padding: 20px; border-radius: 12px; margin: 20px 0;">
        <p style="margin: 4px 0;"><strong>Finalized Price:</strong> Rp ${quotedPrice.toLocaleString('id-ID')}</p>
        <p style="margin: 4px 0;"><strong>Down Payment Required:</strong> ${escapeHtml(downPaymentRequirement)}</p>
      </div>
      <p>You can review the full project proposal/scope specification by clicking below:</p>
      <a href="${sanitizeUrl(proposalUrl)}" target="_blank" style="display: inline-block; background-color: #ffffff; color: #09090b; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">View Project Proposal</a>
    </div>`;

    await this.sendMail(to, `Project Proposal & Down Payment Invoice: ${projectTitle}`, emailHtml);
  }

  async sendProgressUpdateEmail(
    to: string,
    clientName: string,
    projectTitle: string,
    repoLink: string,
    stagingUrl: string,
    managementBoardUrl: string
  ): Promise<void> {
    const emailHtml = `<div style="background-color: #09090b; color: #ffffff; padding: 40px; font-family: sans-serif; border-radius: 16px;">
      <h2>Development Progress Update</h2>
      <p>Hi ${escapeHtml(clientName)},</p>
      <p>Development is actively underway for <strong>${escapeHtml(projectTitle)}</strong>!</p>
      <p>Here are your active engineering workspace links to track progress in real-time:</p>
      <ul>
        <li><strong>Staging Environment:</strong> <a href="${sanitizeUrl(stagingUrl)}" style="color: #60a5fa;">${escapeHtml(stagingUrl)}</a></li>
        <li><strong>Git Repository:</strong> <a href="${sanitizeUrl(repoLink)}" style="color: #60a5fa;">${escapeHtml(repoLink)}</a></li>
        <li><strong>Task Board:</strong> <a href="${sanitizeUrl(managementBoardUrl)}" style="color: #60a5fa;">${escapeHtml(managementBoardUrl)}</a></li>
      </ul>
    </div>`;

    await this.sendMail(to, `Active Development Workspace Linked: ${projectTitle}`, emailHtml);
  }

  async sendSignOffRequestEmail(
    to: string,
    clientName: string,
    projectTitle: string,
    feedbackTrackerUrl: string
  ): Promise<void> {
    const emailHtml = `<div style="background-color: #09090b; color: #ffffff; padding: 40px; font-family: sans-serif; border-radius: 16px;">
      <h2>Staging Environment Sign-Off Request</h2>
      <p>Hi ${escapeHtml(clientName)},</p>
      <p>The core features for <strong>${escapeHtml(projectTitle)}</strong> are ready on our staging server for QA and review.</p>
      <p>Please test the staging environment and submit any feedback through the Loom or Notion tracker link:</p>
      <div style="margin: 20px 0;">
        <a href="${sanitizeUrl(feedbackTrackerUrl)}" style="background-color: #ffffff; color: #09090b; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Open Feedback Tracker</a>
      </div>
      <p>Once you are happy, please authorize the final sign-off.</p>
    </div>`;

    await this.sendMail(to, `Platform Ready for Review: ${projectTitle}`, emailHtml);
  }

  async sendHandoverPackageEmail(
    to: string,
    clientName: string,
    projectTitle: string,
    productionUrl: string,
    codebaseTransferUrl: string,
    warrantyEndDate: string
  ): Promise<void> {
    const warrantyDateStr = new Date(warrantyEndDate).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const emailHtml = `<div style="background-color: #09090b; color: #ffffff; padding: 40px; font-family: sans-serif; border-radius: 16px;">
      <h2>Project Handover Package</h2>
      <p>Hi ${escapeHtml(clientName)},</p>
      <p>Congratulations! We have officially deployed <strong>${escapeHtml(projectTitle)}</strong> to production.</p>
      <p>Here are your final project access credentials and downloadable source files:</p>
      <ul>
        <li><strong>Live Application:</strong> <a href="${sanitizeUrl(productionUrl)}" style="color: #60a5fa;">${escapeHtml(productionUrl)}</a></li>
        <li><strong>ZIP Archive / Repository Transfer:</strong> <a href="${sanitizeUrl(codebaseTransferUrl)}" style="color: #60a5fa;">${escapeHtml(codebaseTransferUrl)}</a></li>
        <li><strong>Support / Warranty Window Ends:</strong> ${escapeHtml(warrantyDateStr)}</li>
      </ul>
    </div>`;

    await this.sendMail(to, `Final Handover Package Confirmed: ${projectTitle}`, emailHtml);
  }
}

export const emailService = new NodemailerEmailService();
