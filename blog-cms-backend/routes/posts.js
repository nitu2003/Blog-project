const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/authMiddleware');

// Get All Posts
router.get('/get-all-post', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name').limit(1).sort({createdAt : -1});
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Update Post
router.put('/update-post/:id', auth, async (req, res) => {
  const { title, content, categories } = req.body;


  console.log(
  'yeh :id wala req ', req.params.id
  ) 

  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: { title, content, categories } },
      { new: true }
    );

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create Post
router.post('/create-post', auth, async (req, res) => {
  const { title, content, categories } = req.body;

  console.log(
    'yeh create post wala req'
    )

  try {
    const newPost = new Post({
      title,
      content,
      categories,
      author: req.user.id,
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



// Delete Post
router.delete('/:id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Post.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
