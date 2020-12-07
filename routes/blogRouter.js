const express = require('express');

const Blogs = require('../models/blogs');
const authenticate = require('../authenticate');
const cors = require('../cors');

const blogRouter = express.Router();

blogRouter.use(express.json());

blogRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.corsWithOptions, async (req, res, next) => {
    try {
      const blogs = await Blogs.find(req.query)
      res.status(200).json(blogs);
    } catch (err) { next(err); }
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      const blog = await Blogs.create(req.body)
      res.status(200).json(blog);
    } catch (err) { next(err); }
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      const resp = await Blogs.deleteMany({})
      res.status(200).json(resp);
    } catch (err) { next(err); }
  });

blogRouter.route('/:slug')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.corsWithOptions, async (req, res, next) => {
    try {
      const blog = await Blogs.findOne({ slug: req.params.slug })
      res.status(200).json(blog);
    } catch (err) { next(err); }
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      const blog = await Blogs.findOneAndUpdate({ slug: req.params.slug }, { $set: req.body }, { new: true })
      res.status(200).json(blog);
    } catch (err) { next(err); }
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      const blog = await Blogs.findOneAndDelete({ slug: req.params.slug })
      res.status(200).json(blog);
    } catch (err) { next(err); }
  });

module.exports = blogRouter;
