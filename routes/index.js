const path = require("path");
const router = require("express").Router();
const apiRoutes = require("./api");
var passport = require('passport');
var User = require('../models/user');

// API Routes
router.use("/api", apiRoutes);

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "../signin.html"));
});

router.get('/signup', function(req, res) {
  res.sendFile(path.join(__dirname, "../signup.html"));
});

// If no API routes are hit, send the React app
// router.use(function(req, res) {
//   res.sendFile(path.join(__dirname, "../client/build/index.html"));
// });

module.exports = router;