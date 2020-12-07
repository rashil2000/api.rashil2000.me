require('dotenv').config();
var express = require('express');

var app = express();

app.set('json spaces', 2);
app.use(require('morgan')('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('cookie-parser')());
app.use(require('passport').initialize());

app.use('/users', require('./routes/userRouter'));
app.use('/blogs', require('./routes/blogRouter'));
app.use('/projects', require('./routes/projectRouter'));
app.use('/assets', require('./routes/assetRouter'));

app.use(express.static(require('path').join(__dirname, 'public')));
app.get('/', (req, res) => res.status(301).redirect(process.env.DOC_URL));

require('mongoose').connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(
  db => console.log('Connected to the database server -', db.connections[0].name),
  err => console.log(err)
);

module.exports = app;
