class NotificationService {
  constructor() {
    this.permission = 'default';
    this.isSupported = 'Notification' in window;
  }

  // Request permission with custom pre-prompt
  async requestPermission(customMessage) {
    if (!this.isSupported) {
      return false;
    }

    // Show custom pre-prompt first
    const userWantsNotifications = await this.showPrePrompt(customMessage);
    
    if (!userWantsNotifications) {
      return false;
    }

    // Request actual permission
    const permission = await Notification.requestPermission();
    this.permission = permission;
    
    return permission === 'granted';
  }

  // Custom pre-prompt dialog
  showPrePrompt(message) {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
      modal.innerHTML = `
        <div class="bg-white rounded-2xl p-6 max-w-md w-full">
          <div class="text-center mb-6">
            <div class="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              🔔
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">Stay on Track</h2>
            <p class="text-gray-600">${message || 'Get gentle reminders to maintain your learning streak and never miss a study session.'}</p>
          </div>
          
          <div class="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 class="font-semibold text-blue-800 mb-2">We'll send you:</h3>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• Daily streak reminders (only when needed)</li>
              <li>• Review session alerts for weak areas</li>
              <li>• Celebration messages for achievements</li>
            </ul>
          </div>
          
          <div class="flex gap-3">
            <button id="deny-btn" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Not Now
            </button>
            <button id="allow-btn" class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Enable Reminders
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      modal.querySelector('#allow-btn').onclick = () => {
        document.body.removeChild(modal);
        resolve(true);
      };

      modal.querySelector('#deny-btn').onclick = () => {
        document.body.removeChild(modal);
        resolve(false);
      };

      modal.onclick = (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
          resolve(false);
        }
      };
    });
  }

  // Schedule a notification
  scheduleNotification(title, body, delay = 0, tag = null) {
    if (this.permission !== 'granted') {
      return false;
    }

    setTimeout(() => {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: tag || 'casequest-reminder',
        requireInteraction: false,
        silent: false
      });
    }, delay);

    return true;
  }

  // Schedule streak reminder
  scheduleStreakReminder(userStats) {
    if (!userStats.preferredTime) return;

    const now = new Date();
    const lastActivity = userStats.lastActivity ? new Date(userStats.lastActivity) : null;
    const hoursSinceActivity = lastActivity ? (now - lastActivity) / (1000 * 60 * 60) : 24;

    // Only remind if it's been more than 20 hours
    if (hoursSinceActivity < 20) return;

    const reminderTime = this.getNextReminderTime(userStats.preferredTime);
    const delay = reminderTime - now.getTime();

    if (delay > 0 && delay < 24 * 60 * 60 * 1000) { // Within 24 hours
      this.scheduleNotification(
        '🔥 Keep your streak alive!',
        `Don't lose your ${userStats.streak}-day streak. Just 5 minutes of practice will do!`,
        delay,
        'streak-reminder'
      );
    }
  }

  // Get next reminder time based on user preference
  getNextReminderTime(preferredTime) {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let hour;
    switch (preferredTime) {
      case 'morning':
        hour = 9; // 9 AM
        break;
      case 'afternoon':
        hour = 15; // 3 PM
        break;
      case 'evening':
        hour = 19; // 7 PM
        break;
      default:
        hour = 19;
    }

    const reminderTime = new Date(tomorrow);
    reminderTime.setHours(hour, 0, 0, 0);

    return reminderTime.getTime();
  }

  // Schedule review reminder
  scheduleReviewReminder(dueCount) {
    if (dueCount === 0) return;

    this.scheduleNotification(
      '📚 Quick review ready!',
      `You have ${dueCount} concept${dueCount > 1 ? 's' : ''} ready for review. Just 3 minutes!`,
      5 * 60 * 1000, // 5 minutes delay
      'review-reminder'
    );
  }

  // Celebration notification
  showCelebration(achievement) {
    this.scheduleNotification(
      '🎉 Achievement Unlocked!',
      achievement,
      0,
      'celebration'
    );
  }

  // Clear all scheduled notifications
  clearNotifications() {
    // Note: Can't actually clear scheduled setTimeout notifications
    // This would need to be implemented with a proper scheduling system
  }
}

export default new NotificationService();
