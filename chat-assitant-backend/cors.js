
const cors = require('cors');

function Cors(app) {
    const whitelist = ['http://localhost:3000', 'http://localhost:5001']; // assuming front-end application is running on localhost port 3000
    const corsOptions = {
      origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      }
    }
    app.use(cors(corsOptions));
}

module.exports = { Cors }