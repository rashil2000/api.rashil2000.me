/**
 * @swagger
 *  components:
 *    schemas:
 *      Blog:
 *        type: object
 *        required:
 *          - title
 *          - description
 *          - slug
 *          - date
 *          - content
 *        properties:
 *          id:
 *            type: ObjectID
 *            description: The auto-generated id of the blog.
 *          title:
 *            type: string
 *            description: The title of the blog.
 *          description:
 *            type: string
 *            description: A one line summary of the blog.
 *          content:
 *            type: string
 *            description: The blog itself.
 *          slug:
 *            type: string
 *            description: Unique URL identifier.
 *          date:
 *            type: date
 *            description: The date of blog creation.
 *        example:
 *           title: My first Blog
 *           description: How I started my journey.
 *           content: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis diam quis massa eleifend vehicula ultricies finibus turpis. Etiam sollicitudin efficitur auctor.
 *           slug: my-first-blog
 *           date: 2020-10-06T19:17:30.148Z
 */

const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Blog', blogSchema);