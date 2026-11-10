const notificationController = require('../src/Controllers/notificationController');
const prisma = require('../src/lib/prisma');

jest.mock('../src/lib/prisma', () => ({
  notification: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    createMany: jest.fn(),
  },
  user: {
    findMany: jest.fn(),
  },
}));

describe('Notification Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: {},
      body: {},
      user: { userId: 'stu-1', role: 'STUDENT' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('lists notifications for the authenticated user', async () => {
    prisma.notification.findMany.mockResolvedValue([
      {
        id: 'notif-1',
        title: 'Assignment Graded',
        message: 'Your assignment scored 98/100.',
        type: 'GRADE',
        isRead: false,
        createdAt: new Date(),
      },
    ]);

    await notificationController.getMyNotifications(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'notif-1',
          title: 'Assignment Graded',
          isRead: false,
        }),
      ])
    );
  });

  it('marks a single notification as read', async () => {
    req.params.id = 'notif-1';
    prisma.notification.findUnique.mockResolvedValue({ id: 'notif-1', userId: 'stu-1' });
    prisma.notification.update.mockResolvedValue({ id: 'notif-1', isRead: true });

    await notificationController.markAsRead(req, res);

    expect(prisma.notification.update).toHaveBeenCalledWith({
      where: { id: 'notif-1' },
      data: { isRead: true },
    });
  });

  it('marks all notifications as read', async () => {
    prisma.notification.updateMany.mockResolvedValue({ count: 5 });

    await notificationController.markAllAsRead(req, res);

    expect(prisma.notification.updateMany).toHaveBeenCalledWith({
      where: { userId: 'stu-1', isRead: false },
      data: { isRead: true },
    });
    expect(res.json).toHaveBeenCalledWith({ message: 'All notifications marked as read.' });
  });

  it('broadcasts notification to all users when requested by admin', async () => {
    req.user = { userId: 'admin-1', role: 'ADMIN' };
    req.body = {
      title: 'Scheduled Maintenance',
      message: 'Server maintenance this Saturday at 2 AM.',
      type: 'SYSTEM',
    };
    prisma.user.findMany.mockResolvedValue([{ id: 'u1' }, { id: 'u2' }]);
    prisma.notification.createMany.mockResolvedValue({ count: 2 });

    await notificationController.broadcastNotification(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(prisma.notification.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({ userId: 'u1', type: 'SYSTEM' }),
        expect.objectContaining({ userId: 'u2', type: 'SYSTEM' }),
      ]),
    });
  });
});

