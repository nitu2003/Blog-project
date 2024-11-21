const express = require('express');
const router = express.Router();
const Comment = require('../models/Comments');
const auth = require('../middleware/authMiddleware');

// Get Comments for a Post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add a Comment to a Post
router.post('/:postId', auth, async (req, res) => {
  const { text } = req.body;

  try {
    const newComment = new Comment({
      postId: req.params.postId,
      author: req.user.name, // Assuming the user is authenticated and has a `name`
      text,
    });

    const comment = await newComment.save();
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a Comment by ID
router.delete('/:commentId', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Assuming only the comment author or post owner can delete the comment
    if (comment.author !== req.user.name) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await comment.remove();
    res.json({ msg: 'Comment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
