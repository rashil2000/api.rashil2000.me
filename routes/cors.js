const cors = require('cors');

const whitelist = process.env.CORS_WHITELIST.split(',');
var corsOptionsDelegate = (req, callback) => {
  var corsOptions;
  console.log(req.header('Origin'));
  if (whitelist.indexOf(req.header('Origin')) !== -1)
    corsOptions = { origin: true };
  else
    corsOptions = { origin: false };
  callback(null, corsOptions);
};

// exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);