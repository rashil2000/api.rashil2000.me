const express = require('express');

const Projects = require('../models/projects');
const authenticate = require('../authenticate');
const cors = require('../cors');

const projectRouter = express.Router();

projectRouter.use(express.json());

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
