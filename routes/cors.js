const cors = require('cors');

const whitelist = ['http://localhost:5000', 'https://localhost:5443', 'http://localhost:3000'];
var corsOptionsDelegate = (req, callback) => {
  var corsOptions;
  console.log(req.header('Origin'));
  if (whitelist.indexOf(req.header('Origin')) !== -1)
    corsOptions = { origin: true };
  else
    corsOptions = { origin: false };
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);