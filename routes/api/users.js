const router = require("express").Router();
const usersController = require("../../controller/usersController");
const passport = require("passport")
const User = require('../../models/user');

// Matches with "/api/users" (create a if else in post for signin and signup)
router.route("/")
  .get(usersController.findAll)


  // create passport authentication routes with redirects
  router.post('/signup', function(req, res, next) {
    console.log('registering user');
    User.register({username: req.body.username, password: req.body.password}, function(err) {
      if (err) {
        console.log('error while user register!', err);
        return next(err);
      }
  
      console.log('user registered!');
  
      res.redirect('/');
    });
  });
  
  router.post('/signin', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
  });

// Matches with "/api/users/:id"
router
  .route("/:id")
  .get(usersController.findById)
  .put(usersController.update)
  .delete(usersController.remove);

module.exports = router;