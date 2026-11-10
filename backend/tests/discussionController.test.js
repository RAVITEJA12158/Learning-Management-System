const discussionController = require('../src/Controllers/discussionController');
const prisma = require('../src/lib/prisma');

jest.mock('../src/lib/prisma', () => ({
  discussion: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  discussionReply: {
    create: jest.fn(),
    delete: jest.fn(),
  },
  notification: {
    create: jest.fn(),
  },
  course: {
    findUnique: jest.fn(),
  },
  courseEnrollment: {
    findUnique: jest.fn(),
  },
}));

describe('Discussion Controller', () => {
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

  it('retrieves discussion threads with nested replies', async () => {
    req.params.courseId = 'c1';
    prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'fac-1', instructors: [] });
    prisma.courseEnrollment.findUnique.mockResolvedValue({ status: 'ACTIVE' });
    prisma.discussion.findMany.mockResolvedValue([
      {
        id: 'th-1',
        courseId: 'c1',
        title: 'Question about recursion',
        content: 'How does stack frame unwinding work?',
        createdAt: new Date(),
        user: { name: 'Sarah Jensen', role: 'STUDENT' },
        replies: [
          {
            id: 'rep-1',
            content: 'Each return pops the frame off the call stack.',
            createdAt: new Date(),
            user: { name: 'Dr. Alan Turing', role: 'FACULTY' },
          },
        ],
      },
    ]);

    await discussionController.getDiscussionsByCourse(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'th-1',
          title: 'Question about recursion',
          author: 'Sarah Jensen',
          replies: expect.arrayContaining([
            expect.objectContaining({
              author: 'Dr. Alan Turing',
              authorRole: 'Instructor',
            }),
          ]),
        }),
      ])
    );
  });

  it('posts a new discussion thread', async () => {
    req.body = {
      courseId: 'c1',
      title: 'Clarification on Big-O',
      content: 'Can someone explain tight upper bounds?',
    };
    prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'fac-1', instructors: [] });
    prisma.courseEnrollment.findUnique.mockResolvedValue({ status: 'ACTIVE' });
    prisma.discussion.create.mockResolvedValue({
      id: 'th-2',
      courseId: 'c1',
      title: 'Clarification on Big-O',
      content: 'Can someone explain tight upper bounds?',
      createdAt: new Date(),
      user: { name: 'Sarah Jensen', role: 'STUDENT' },
      userId: 'stu-1',
    });

    await discussionController.createDiscussion(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'th-2',
        title: 'Clarification on Big-O',
      })
    );
  });

  it('adds a reply and notifies the thread author', async () => {
    req.params.id = 'th-2';
    req.body = { content: 'Big-O describes an asymptotic upper bound.' };
    req.user = { userId: 'fac-1', role: 'FACULTY' };

    prisma.discussion.findUnique.mockResolvedValue({
      id: 'th-2',
      courseId: 'c1',
      userId: 'stu-1',
      title: 'Clarification on Big-O',
    });
    prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'fac-1', instructors: [] });
    prisma.discussionReply.create.mockResolvedValue({
      id: 'rep-2',
      discussionId: 'th-2',
      content: 'Big-O describes an asymptotic upper bound.',
      createdAt: new Date(),
      user: { name: 'Dr. Alan Turing', role: 'FACULTY' },
      userId: 'fac-1',
    });
    prisma.notification.create.mockResolvedValue({ id: 'notif-1' });

    await discussionController.createReply(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(prisma.notification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'stu-1',
          type: 'DISCUSSION',
        }),
      })
    );
  });
});

