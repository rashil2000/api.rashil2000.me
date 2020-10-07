/**
 * @swagger
 *  components:
 *    securitySchemas:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *    parameters:
 *      authParam:
 *        in: header
 *        name: Authorization
 *        required: true
 *        schema:
 *          type: string
 *        example: bearer <JSONWebToken>
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    default: ''
  },
  lastname: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

userSchema.plugin(require('passport-local-mongoose'));

module.exports = mongoose.model('User', userSchema);