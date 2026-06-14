/**
 * Email Notification Service for 24 To-Do
 * Manages email templates, stores local email logs, and sends emails
 * via Simulator, EmailJS, Resend, or Custom Webhooks.
 */

// Helper to format dates nicely
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Generate high-end HTML email templates matching the app design system
export const generateEmailHTML = (event, data, recipientName) => {
  const accentColor = '#7c5cfc';
  const bgColor = '#0d0f1a';
  const cardBg = '#131525';
  const textColor = '#e2e8f0';
  const textMuted = '#94a3b8';
  
  let eventTitle = '';
  let eventDetailHtml = '';
  let footerMsg = 'This is an automated notification from your 24 To-Do App.';

  switch (event) {
    case 'task_created':
      eventTitle = 'New Task Created';
      eventDetailHtml = `
        <div style="margin-bottom: 24px; padding: 20px; background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px;">
          <h3 style="margin-top: 0; color: #ffffff; font-size: 18px; font-weight: 700;">${data.name}</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 6px 0; color: ${textMuted}; font-size: 14px; width: 100px;">Project</td>
              <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${data.project}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: ${textMuted}; font-size: 14px;">Priority</td>
              <td style="padding: 6px 0; font-size: 14px; font-weight: 600;">
                <span style="color: ${data.priority === 'High' ? '#f87171' : data.priority === 'Medium' ? '#facc15' : '#4ade80'}">
                  ● ${data.priority}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: ${textMuted}; font-size: 14px;">Due Date</td>
              <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${formatDate(data.dueDate)}</td>
            </tr>
          </table>
        </div>
        <p style="color: ${textColor}; font-size: 15px; line-height: 1.6;">A new task has been successfully scheduled. Make sure to complete it before the due date!</p>
      `;
      break;

    case 'task_completed':
      eventTitle = 'Task Completed! 🎉';
      eventDetailHtml = `
        <div style="margin-bottom: 24px; padding: 20px; background-color: rgba(74,222,128,0.05); border: 1px solid rgba(74,222,128,0.2); border-radius: 12px; text-align: center;">
          <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 50%; background-color: #4ade80; color: #0d0f1a; font-size: 24px; font-weight: bold; margin-bottom: 15px;">✓</div>
          <h3 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 700;">Task Done</h3>
          <p style="margin: 8px 0 0 0; color: #4ade80; font-size: 15px; font-weight: 600;">"${data.name}"</p>
        </div>
        <p style="color: ${textColor}; font-size: 15px; line-height: 1.6; text-align: center;">Great job! You completed this task. Keep up the amazing momentum!</p>
      `;
      break;

    case 'task_due':
      eventTitle = 'Task Due Reminder ⏰';
      eventDetailHtml = `
        <div style="margin-bottom: 24px; padding: 20px; background-color: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.2); border-radius: 12px;">
          <h3 style="margin-top: 0; color: #ffffff; font-size: 18px; font-weight: 700; display: flex; align-items: center;">
            ⚠️ Action Required
          </h3>
          <p style="color: #ffffff; font-size: 16px; font-weight: 600; margin-bottom: 12px;">"${data.name}" is due today!</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; color: ${textMuted}; font-size: 14px; width: 100px;">Project</td>
              <td style="padding: 4px 0; color: #ffffff; font-size: 14px;">${data.project}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: ${textMuted}; font-size: 14px;">Priority</td>
              <td style="padding: 4px 0; font-size: 14px; font-weight: 600; color: ${data.priority === 'High' ? '#f87171' : '#facc15'}">${data.priority}</td>
            </tr>
          </table>
        </div>
        <p style="color: ${textColor}; font-size: 15px; line-height: 1.6;">Don't let it slip! Please make sure to complete this task by the end of today.</p>
      `;
      break;

    case 'test_email':
      eventTitle = 'Connection Successful! 🚀';
      eventDetailHtml = `
        <div style="margin-bottom: 24px; padding: 20px; background-color: rgba(124,92,252,0.05); border: 1px solid rgba(124,92,252,0.2); border-radius: 12px; text-align: center;">
          <h3 style="margin: 0 0 10px 0; color: #ffffff; font-size: 18px; font-weight: 700;">Integration Working</h3>
          <p style="margin: 0; color: ${textMuted}; font-size: 14px;">Your notification channel has been configured correctly.</p>
        </div>
        <p style="color: ${textColor}; font-size: 15px; line-height: 1.6;">This is a test notification to verify your automated email settings in 24 To-Do. Your configuration is fully operational!</p>
      `;
      footerMsg = 'You received this because you initiated a connection test in settings.';
      break;

    default:
      eventTitle = 'Notification';
      eventDetailHtml = `<p style="color: ${textColor}; font-size: 15px;">Automated update: ${JSON.stringify(data)}</p>`;
  }

  // Complete premium HTML structure
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${eventTitle}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${bgColor}; font-family: 'Sora', 'Segoe UI', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${bgColor}; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Card Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: ${cardBg}; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          
          <!-- Header Accent Line -->
          <tr>
            <td height="4" style="background: linear-gradient(to right, ${accentColor}, #6366f1);"></td>
          </tr>
          
          <!-- Content Body -->
          <tr>
            <td style="padding: 40px 32px;">
              <!-- Logo / App Name -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td>
                    <span style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">🐒 24 To-Do</span>
                  </td>
                  <td align="right">
                    <span style="font-size: 11px; font-weight: 700; color: ${accentColor}; text-transform: uppercase; background-color: rgba(124,92,252,0.1); padding: 4px 10px; border-radius: 6px; letter-spacing: 0.5px;">Automated</span>
                  </td>
                </tr>
              </table>
              
              <!-- Greeting -->
              <p style="color: #ffffff; font-size: 16px; font-weight: 600; margin-top: 0; margin-bottom: 16px;">Hello ${recipientName || 'User'},</p>
              
              <!-- Event Title -->
              <h2 style="color: #ffffff; font-size: 22px; font-weight: 800; margin-top: 0; margin-bottom: 20px; letter-spacing: -0.5px;">${eventTitle}</h2>
              
              <!-- Core Details -->
              ${eventDetailHtml}
              
              <!-- Call to Action -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 35px; margin-bottom: 10px;">
                <tr>
                  <td align="center">
                    <a href="https://example.com/dashboard" target="_blank" style="display: inline-block; padding: 12px 28px; background-color: ${accentColor}; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; border-radius: 12px; box-shadow: 0 10px 20px rgba(124,92,252,0.3); transition: all 0.3s ease;">
                      Open Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.03); text-align: center;">
              <p style="margin: 0; color: ${textMuted}; font-size: 12px; line-height: 1.5;">${footerMsg}</p>
              <p style="margin: 8px 0 0 0; color: ${textMuted}; font-size: 11px;">&copy; 2026 24 To-Do App. All rights reserved.</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// Log email event in local storage outbox
const logEmail = (event, recipient, subject, html, status, provider, error = null) => {
  try {
    const existingLogs = JSON.parse(localStorage.getItem('ape-email-log') || '[]');
    const newLog = {
      id: `mail_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      event,
      to: recipient,
      subject,
      html,
      status,
      provider,
      error,
      timestamp: new Date().toISOString()
    };
    
    // Maintain maximum 100 entries to prevent localStorage bloat
    const updatedLogs = [newLog, ...existingLogs].slice(0, 100);
    localStorage.setItem('ape-email-log', JSON.stringify(updatedLogs));
    
    // Dispatch a custom event to notify components (like Dashboard) to reload logs
    window.dispatchEvent(new Event('ape-email-log-updated'));
    return newLog;
  } catch (err) {
    console.error('Error logging email notification:', err);
    return null;
  }
};

// Main entry point for dispatching automated email notifications
export const sendEmailNotification = async (event, data) => {
  // 1. Get current registration name and email
  const recipientName = localStorage.getItem('registeredName') || 'John Doe';
  const recipientEmail = localStorage.getItem('registeredEmail') || 'udarawijesekara9@gmail.com';
  
  // 2. Fetch email integration settings from localStorage
  const enabled = localStorage.getItem('emailNotifEnabled') === 'true';
  const provider = localStorage.getItem('emailProvider') || 'simulator'; // simulator, emailjs, resend, webhook
  
  // Always trigger if it's a test email, regardless of the 'enabled' toggle
  if (!enabled && event !== 'test_email') {
    console.log(`Email notifications disabled. Skipping email for event: ${event}`);
    return { success: false, reason: 'Disabled' };
  }

  // 3. Set subject line based on event type
  let subject = 'Notification from 24 To-Do';
  if (event === 'task_created') subject = `[24 To-Do] Task Created: ${data.name}`;
  if (event === 'task_completed') subject = `[24 To-Do] Task Completed: ${data.name}`;
  if (event === 'task_due') subject = `[24 To-Do] Due Today: ${data.name}`;
  if (event === 'test_email') subject = `[24 To-Do] Test Notification Integration`;

  // 4. Generate the HTML content
  const htmlContent = generateEmailHTML(event, data, recipientName);

  console.log(`Sending automated email (${provider}) for event "${event}" to ${recipientEmail}`);

  // 5. Send via the chosen provider
  if (provider === 'simulator') {
    // Simulated delivery is immediate and successful
    const log = logEmail(event, recipientEmail, subject, htmlContent, 'sent', 'simulator');
    
    // Show a beautiful custom toast alert on the client side
    const toastEvent = new CustomEvent('ape-toast', {
      detail: {
        title: 'Simulated Email Sent ✉️',
        message: `Sent "${subject}" to ${recipientEmail}. View it in the Outbox Log.`,
        type: 'success'
      }
    });
    window.dispatchEvent(toastEvent);
    
    return { success: true, log };
  }

  if (provider === 'emailjs') {
    const serviceId = localStorage.getItem('emailjsServiceId');
    const templateId = localStorage.getItem('emailjsTemplateId');
    const userId = localStorage.getItem('emailjsPublicKey'); // user_id / public key
    
    if (!serviceId || !templateId || !userId) {
      const errorMsg = 'EmailJS credentials incomplete. Check settings.';
      logEmail(event, recipientEmail, subject, htmlContent, 'failed', 'emailjs', errorMsg);
      return { success: false, reason: errorMsg };
    }

    try {
      // EmailJS REST API payload
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: userId,
          template_params: {
            to_email: recipientEmail,
            to_name: recipientName,
            subject: subject,
            event_type: event,
            task_name: data?.name || '',
            task_project: data?.project || '',
            task_priority: data?.priority || '',
            task_due_date: data?.dueDate ? formatDate(data.dueDate) : '',
            message_html: htmlContent
          }
        })
      });

      if (response.ok) {
        const log = logEmail(event, recipientEmail, subject, htmlContent, 'sent', 'emailjs');
        return { success: true, log };
      } else {
        const errorText = await response.text();
        const errorMsg = `EmailJS error (${response.status}): ${errorText}`;
        logEmail(event, recipientEmail, subject, htmlContent, 'failed', 'emailjs', errorMsg);
        return { success: false, reason: errorMsg };
      }
    } catch (err) {
      const errorMsg = `Fetch failed: ${err.message}`;
      logEmail(event, recipientEmail, subject, htmlContent, 'failed', 'emailjs', errorMsg);
      return { success: false, reason: errorMsg };
    }
  }

  if (provider === 'resend') {
    const apiKey = localStorage.getItem('resendApiKey');
    const fromEmail = localStorage.getItem('resendFromEmail') || 'onboarding@resend.dev';
    
    if (!apiKey) {
      const errorMsg = 'Resend API key missing. Check settings.';
      logEmail(event, recipientEmail, subject, htmlContent, 'failed', 'resend', errorMsg);
      return { success: false, reason: errorMsg };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          from: fromEmail,
          to: recipientEmail,
          subject: subject,
          html: htmlContent
        })
      });

      if (response.ok) {
        const log = logEmail(event, recipientEmail, subject, htmlContent, 'sent', 'resend');
        return { success: true, log };
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = `Resend error: ${errorData.message || response.statusText}`;
        logEmail(event, recipientEmail, subject, htmlContent, 'failed', 'resend', errorMsg);
        return { success: false, reason: errorMsg };
      }
    } catch (err) {
      const errorMsg = `Fetch failed (Note: CORS restrictions may apply when calling Resend directly from the client side): ${err.message}`;
      logEmail(event, recipientEmail, subject, htmlContent, 'failed', 'resend', errorMsg);
      return { success: false, reason: errorMsg };
    }
  }

  if (provider === 'webhook') {
    const url = localStorage.getItem('webhookUrl');
    
    if (!url) {
      const errorMsg = 'Webhook URL is missing. Check settings.';
      logEmail(event, recipientEmail, subject, htmlContent, 'failed', 'webhook', errorMsg);
      return { success: false, reason: errorMsg };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event,
          to: recipientEmail,
          name: recipientName,
          subject,
          task: data,
          html: htmlContent,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const log = logEmail(event, recipientEmail, subject, htmlContent, 'sent', 'webhook');
        return { success: true, log };
      } else {
        const errorMsg = `Webhook responded with status ${response.status}`;
        logEmail(event, recipientEmail, subject, htmlContent, 'failed', 'webhook', errorMsg);
        return { success: false, reason: errorMsg };
      }
    } catch (err) {
      const errorMsg = `Webhook POST failed: ${err.message}`;
      logEmail(event, recipientEmail, subject, htmlContent, 'failed', 'webhook', errorMsg);
      return { success: false, reason: errorMsg };
    }
  }

  return { success: false, reason: 'Unknown provider' };
};
