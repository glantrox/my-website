export class TelemetryLogger {
  static sanitize(payload: any): any {
    if (!payload) return payload;
    try {
      const sanitized = JSON.parse(JSON.stringify(payload));
      const sensitiveKeys = ['password', 'token', 'secret', 'auth', 'cvv', 'card', 'pin', 'key'];
      
      const walk = (obj: any) => {
        if (typeof obj !== 'object' || obj === null) return;
        for (const k in obj) {
          if (sensitiveKeys.some(sk => k.toLowerCase().includes(sk))) {
            obj[k] = '***MASKED***';
          } else if (typeof obj[k] === 'object') {
            walk(obj[k]);
          }
        }
      };
      
      walk(sanitized);
      return sanitized;
    } catch {
      return '[Unsanitizable Payload]';
    }
  }

  static logError(error: Error | unknown, context?: { route?: string; payload?: Record<string, any> }) {
    const errObj = error instanceof Error ? error : new Error(String(error));
    const sanitizedPayload = this.sanitize(context?.payload);
    
    const logData = {
      message: errObj.message,
      stack: errObj.stack,
      route: context?.route || (typeof window !== 'undefined' ? window.location.pathname : 'server-context'),
      payload: sanitizedPayload,
      timestamp: new Date().toISOString()
    };

    // Centralized logging endpoint / Sentry pipeline mock
    console.error('[TELEMETRY_ERROR]', JSON.stringify(logData, null, 2));
  }
}
