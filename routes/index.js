const path = require("path");
const router = require("express").Router();
const apiRoutes = require("./api");
var passport = require('passport');
var User = require('../models/user');

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

// API Routes
// router.use("/api", apiRoutes);

// router.get('/signin', function (req, res) {
//   if (req.user) {
//     res.redirect("/");
//   }
//   res.sendFile(path.join(__dirname, "../signin.html"));
// });

// router.get('/signup', function(req, res) {
//   if (req.user) {
//     res.redirect("/");
//   }
//   res.sendFile(path.join(__dirname, "../signup.html"));
// });

// If no API routes are hit, send the React app
router.use(function(req, res) {
  res.sendFile(path.join(__dirname, "../rackers/build/index.html"));
});

module.exports = router;