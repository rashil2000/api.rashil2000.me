const express = require('express');

const Blogs = require('../models/blogs');
const authenticate = require('../authenticate');
const cors = require('./cors');

const blogRouter = express.Router();

blogRouter.use(express.json());


/**
 * @swagger
 * path:
 *  /blogs:
 *    get:
 *      summary: Lists all the blogs
 *      tags: [Blogs]
 *      responses:
 *        "200":
 *          description: The array of blogs.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Blog'
 *    post:
 *      summary: Creates a new blog
 *      tags: [Blogs]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/authParam'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Blog'
 *      responses:
 *        "200":
 *          description: The created blog.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Blog'
 *    delete:
 *      summary: Deletes all the blogs
 *      tags: [Blogs]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/authParam'
 *      responses:
 *        "200":
 *          description: Delete was successful.
 */

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


/**
 * @swagger
 * path:
 *  /blogs/{slug}:
 *    get:
 *      summary: Gets a blog by slug
 *      tags: [Blogs]
 *      parameters:
 *        - in: path
 *          name: slug
 *          schema:
 *            type: string
 *          required: true
 *          description: The blog slug
 *      responses:
 *        "200":
 *          description: The blog.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Blog'
 *    put:
 *      summary: Updates a blog by slug
 *      tags: [Blogs]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: slug
 *          schema:
 *            type: string
 *          required: true
 *          description: The blog slug
 *        - $ref: '#/components/parameters/authParam'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Blog'
 *      responses:
 *        "200":
 *          description: Update was successful.
 *    delete:
 *      summary: Deletes a blog by slug
 *      tags: [Blogs]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: slug
 *          schema:
 *            type: string
 *          required: true
 *          description: The blog slug
 *        - $ref: '#/components/parameters/authParam'
 *      responses:
 *        "200":
 *          description: Delete was successful.
 */

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
