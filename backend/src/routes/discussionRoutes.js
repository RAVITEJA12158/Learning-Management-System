const express = require('express');
const router = express.Router();
const discussionController = require('../Controllers/discussionController');
const { authenticate } = require('../Middleware/auth');

router.get('/course/:courseId', authenticate, discussionController.getDiscussionsByCourse);
router.get('/:id', authenticate, discussionController.getDiscussionById);
router.post('/', authenticate, discussionController.createDiscussion);
router.post('/:id/replies', authenticate, discussionController.createReply);
router.delete('/:id', authenticate, discussionController.deleteDiscussion);
router.delete('/replies/:replyId', authenticate, discussionController.deleteReply);

module.exports = router;

