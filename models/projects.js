/**
 * @swagger
 *  components:
 *    schemas:
 *      Project:
 *        type: object
 *        required:
 *          - title
 *          - description
 *          - slug
 *          - github
 *          - content
 *        properties:
 *          id:
 *            type: ObjectID
 *            description: The auto-generated id of the project.
 *          title:
 *            type: string
 *            description: The title of the project.
 *          description:
 *            type: string
 *            description: A one line summary of the project.
 *          content:
 *            type: string
 *            description: The details of the project.
 *          slug:
 *            type: string
 *            description: Unique URL identifier.
 *          github:
 *            type: string
 *            description: The GitHub identifier of project.
 *          preview:
 *            type: string
 *            description: Optional URL for link preview image.
 *        example:
 *           title: My first Project
 *           description: How I started development.
 *           content: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 *           slug: my-first-project
 *           github: test-user/test-repo
 *           preview: https://api.rashil2000.me/images/projects/my-first-project/preview.png
 */

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  github: {
    type: String,
    required: true
  },
  preview: {
    type: String
  }
});

module.exports = mongoose.model('Project', projectSchema);