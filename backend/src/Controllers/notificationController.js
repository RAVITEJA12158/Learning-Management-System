const prisma = require('../lib/prisma');

/**
 * GET /api/notifications
 * Get logged-in user's notifications.
 */
exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = notifications.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      isRead: n.isRead,
      createdAt: new Date(n.createdAt).toLocaleString(),
    }));

    res.json(formatted);
  } catch (err) {
    console.error('getMyNotifications error:', err);
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
};

/**
 * PUT /api/notifications/:id/read
 * Mark a single notification as read.
 */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) return res.status(404).json({ error: 'Notification not found.' });

    if (notification.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    res.json(updated);
  } catch (err) {
    console.error('markAsRead error:', err);
    res.status(500).json({ error: 'Failed to mark notification as read.' });
  }
};

/**
 * PUT /api/notifications/read-all
 * Mark all notifications for the current user as read.
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    res.json({ message: 'All notifications marked as read.' });
  } catch (err) {
    console.error('markAllAsRead error:', err);
    res.status(500).json({ error: 'Failed to mark all notifications as read.' });
  }
};

/**
 * DELETE /api/notifications/:id
 * Delete a notification.
 */
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) return res.status(404).json({ error: 'Notification not found.' });

    if (notification.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this notification.' });
    }

    await prisma.notification.delete({ where: { id } });
    res.json({ message: 'Notification deleted successfully.' });
  } catch (err) {
    console.error('deleteNotification error:', err);
    res.status(500).json({ error: 'Failed to delete notification.' });
  }
};

/**
 * POST /api/notifications/broadcast (Admin only)
 * Publish a campus-wide alert to all users.
 */
exports.broadcastNotification = async (req, res) => {
  try {
    const { title, message, type, targetRole } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required.' });
    }

    const validTypes = ['ANNOUNCEMENT', 'ASSIGNMENT', 'QUIZ', 'GRADE', 'DISCUSSION', 'SYSTEM'];
    const notifType = validTypes.includes(type) ? type : 'ANNOUNCEMENT';

    const where = {};
    if (targetRole && ['STUDENT', 'FACULTY', 'ADMIN'].includes(targetRole.toUpperCase())) {
      where.role = targetRole.toUpperCase();
    }

    const users = await prisma.user.findMany({
      where,
      select: { id: true },
    });

    if (users.length === 0) {
      return res.json({ message: 'No target users found.' });
    }

    const batch = users.map((u) => ({
      userId: u.id,
      title: title.trim(),
      message: message.trim(),
      type: notifType,
    }));

    await prisma.notification.createMany({ data: batch });

    res.status(201).json({
      message: `Broadcast sent to ${users.length} user(s).`,
      recipientCount: users.length,
      title,
      type: notifType,
    });
  } catch (err) {
    console.error('broadcastNotification error:', err);
    res.status(500).json({ error: 'Failed to broadcast notification.' });
  }
};

