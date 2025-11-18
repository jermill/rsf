// Utility functions for sending notifications (email & SMS)
// Integrate with SendGrid/Mailgun for email and Twilio for SMS when credentials are ready

export async function sendBookingEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  // TODO: Integrate with your email provider (e.g., SendGrid, Mailgun, Supabase Edge Functions)
  // Example placeholder:
  // await fetch('/api/send-email', { method: 'POST', body: JSON.stringify({ to, subject, html }) });
  console.log(`Would send EMAIL to ${to}: ${subject}`);
}

export async function sendBookingSMS({ to, body }: { to: string; body: string }) {
  // TODO: Integrate with Twilio or another SMS provider
  // Example placeholder:
  // await fetch('/api/send-sms', { method: 'POST', body: JSON.stringify({ to, body }) });
  console.log(`Would send SMS to ${to}: ${body}`);
}

// In-app notification system (toast notifications)
type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationOptions {
  type?: NotificationType;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

let notificationContainer: HTMLDivElement | null = null;

function getOrCreateContainer(position: string): HTMLDivElement {
  if (!notificationContainer || !document.body.contains(notificationContainer)) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    notificationContainer.style.cssText = `
      position: fixed;
      z-index: 9999;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
    `;
    
    // Set position
    if (position === 'top-right') {
      notificationContainer.style.top = '0';
      notificationContainer.style.right = '0';
    } else if (position === 'top-left') {
      notificationContainer.style.top = '0';
      notificationContainer.style.left = '0';
    } else if (position === 'bottom-right') {
      notificationContainer.style.bottom = '0';
      notificationContainer.style.right = '0';
    } else if (position === 'bottom-left') {
      notificationContainer.style.bottom = '0';
      notificationContainer.style.left = '0';
    } else if (position === 'top-center') {
      notificationContainer.style.top = '0';
      notificationContainer.style.left = '50%';
      notificationContainer.style.transform = 'translateX(-50%)';
    } else if (position === 'bottom-center') {
      notificationContainer.style.bottom = '0';
      notificationContainer.style.left = '50%';
      notificationContainer.style.transform = 'translateX(-50%)';
    }
    
    document.body.appendChild(notificationContainer);
  }
  return notificationContainer;
}

export function showNotification(
  message: string,
  options: NotificationOptions = {}
): void {
  const {
    type = 'info',
    duration = 3000,
    position = 'top-right'
  } = options;

  const container = getOrCreateContainer(position);

  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    pointer-events: auto;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: white;
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 250px;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
  `;

  // Set background color based on type
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6',
    warning: '#f59e0b'
  };
  notification.style.backgroundColor = colors[type];

  // Add icon
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };
  const icon = document.createElement('span');
  icon.textContent = icons[type];
  icon.style.cssText = `
    font-size: 18px;
    font-weight: bold;
  `;
  notification.appendChild(icon);

  // Add message
  const messageEl = document.createElement('span');
  messageEl.textContent = message;
  messageEl.style.flex = '1';
  notification.appendChild(messageEl);

  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    margin: 0;
    line-height: 1;
    opacity: 0.8;
  `;
  closeBtn.onmouseover = () => { closeBtn.style.opacity = '1'; };
  closeBtn.onmouseout = () => { closeBtn.style.opacity = '0.8'; };
  closeBtn.onclick = () => removeNotification(notification);
  notification.appendChild(closeBtn);

  // Add animation keyframes if not already added
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Add to container
  container.appendChild(notification);

  // Auto remove after duration
  if (duration > 0) {
    setTimeout(() => {
      removeNotification(notification);
    }, duration);
  }
}

function removeNotification(notification: HTMLElement): void {
  notification.style.opacity = '0';
  notification.style.transform = 'translateX(100px)';
  setTimeout(() => {
    notification.remove();
    
    // Clean up container if empty
    if (notificationContainer && notificationContainer.children.length === 0) {
      notificationContainer.remove();
      notificationContainer = null;
    }
  }, 300);
}
