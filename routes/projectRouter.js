const express = require('express');

const Projects = require('../models/projects');
const authenticate = require('../authenticate');
const cors = require('../cors');

const projectRouter = express.Router();

projectRouter.use(express.json());


/**
 * @swagger
 * path:
 *  /projects:
 *    get:
 *      summary: Lists all the projects
 *      tags: [Projects]
 *      responses:
 *        "200":
 *          description: The array of projects.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Project'
 *    post:
 *      summary: Creates a new project
 *      tags: [Projects]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Project'
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/authParam'
 *      responses:
 *        "200":
 *          description: The created project.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Project'
 *    delete:
 *      summary: Deletes all the projects
 *      tags: [Projects]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/authParam'
 *      responses:
 *        "200":
 *          description: Delete was successful.
 */

projectRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.corsWithOptions, async (req, res, next) => {
    try {
      const projects = await Projects.find(req.query)
      res.status(200).json(projects);
    } catch (err) { next(err); }
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      const project = await Projects.create(req.body)
      res.status(200).json(project);
    } catch (err) { next(err); }
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      const resp = await Projects.deleteMany({})
      res.status(200).json(resp);
    } catch (err) { next(err); }
  });


/**
 * @swagger
 * path:
 *  /projects/{slug}:
 *    get:
 *      summary: Gets a project by slug
 *      tags: [Projects]
 *      parameters:
 *        - in: path
 *          name: slug
 *          schema:
 *            type: string
 *          required: true
 *          description: The project slug
 *      responses:
 *        "200":
 *          description: The project.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Project'
 *    put:
 *      summary: Updates a project by slug
 *      tags: [Projects]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: slug
 *          schema:
 *            type: string
 *          required: true
 *          description: The project slug
 *        - $ref: '#/components/parameters/authParam'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Project'
 *      responses:
 *        "200":
 *          description: Update was successful.
 *    delete:
 *      summary: Deletes a project by slug
 *      tags: [Projects]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: slug
 *          schema:
 *            type: string
 *          required: true
 *          description: The project slug
 *        - $ref: '#/components/parameters/authParam'
 *      responses:
 *        "200":
 *          description: Delete was successful.
 */

projectRouter.route('/:slug')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.corsWithOptions, async (req, res, next) => {
    try {
      const project = await Projects.findOne({ slug: req.params.slug })
      res.status(200).json(project);
    } catch (err) { next(err); }
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      const project = await Projects.findOneAndUpdate({ slug: req.params.slug }, { $set: req.body }, { new: true })
      res.status(200).json(project);
    } catch (err) { next(err); }
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      const project = await Projects.findOneAndDelete({ slug: req.params.slug })
      res.status(200).json(project);
    } catch (err) { next(err); }
  });

module.exports = projectRouter;
