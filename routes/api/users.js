const router = require("express").Router();
const usersController = require("../../controller/usersController");
const passport = require("../../config/passport");
const User = require('../../models/user');

// Matches with "/api/users" this is for all users in database
router.route("/")
  .get(usersController.findAll)


// Matches with "/api/users/current" check route for current user 
  router.get('/current', (req, res, next) => {
    console.log('===== user!!======')
    console.log(req.user)
    if (req.user) {
        res.json({ user: req.user })
    } else {
        res.json({ user: null })
    }
})

// router route for signup
router.route("/signup")
// Matches with "/api/users/signup" send info and authenticate with local strategy
    .post('/signup', (req, res) => {
    console.log('user signup');
    

    const { username, password } = req.body
    // ADD VALIDATION
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            console.log('User.js post error: ', err)
        } else if (user) {
            res.json({
                error: `Sorry, already a user with the username: ${username}`
            })
        }
        else {
            const newUser = new User({
                username: username,
                password: password
            })
            newUser.save((err, savedUser) => {
                if (err) return res.json(err)
                res.json(savedUser)
                console.log("im here")
            })
        }
    })
})

router.route("/signup")
// Matches with "api/users/signin" signin route
    .post( '/signin', function (req, res, next) {
        console.log('routes/user.js, login, req.body: ');
        console.log(req.body)
        next()
    },
    passport.authenticate('local'),
    (req, res) => {
        console.log('logged in', req.user);
        var userInfo = {
            username: req.user.username
        };
        res.send(userInfo);
    }
)


// matches with "api/users/logout" used for current user only in session
router.post('/logout', (req, res) => {
    if (req.user) {
        req.logout()
        res.send({ msg: 'logging out' })
    } else {
        res.send({ msg: 'no user to log out' })
    }
})

// Matches with "/api/users/:id"
router
  .route("/:id")
  .get(usersController.findById)
  .put(usersController.update)
  .delete(usersController.remove);

module.exports = router;