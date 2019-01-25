const db = require("../models/user");
const passport = require("../config/passport")

// define the mongoose methods for the userController to get the information required for each specific part.
module.exports = {
    findAll: function (req, res) {
        db
            .find(req.query)
            .sort({ wins: -1 })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    findById: function (req, res) {
        db
            .findById(req.params.id)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },

    // create function for users signing up.
    create: function (req, res) {
        console.log('user signup');
        console.log("req.body before signup" + JSON.stringify(req.body))
        const newUser = new db({
            username: req.body.username,
            name: req.body.name,
            password: req.body.password
        })
        console.log("new User = " + newUser)
        // ADD VALIDATION
        db.findOne({ username: req.body.username }, (err, user) => {
            if (err) {
                console.log('User.js post error: ', err)
            } else if (user) {
                res.json({
                    error: `Sorry, already a user with the username: ${username}`
                })
            }
            else {
                console.log("in controller newUser = " + newUser)
                newUser.save((err, savedUser) => {
                    console.log("saved user = " + savedUser)
                    if (err) return res.json(err)
                    db
                    .create(savedUser)
                    .then(dbModel => res.json(dbModel))
                    .catch(err => res.status(422).json(err))
                    console.log("im here")
                })
                
                
            }
        })
    },

    // signin: function (req, res) {
    //     console.log("controller signin req.body = " + JSON.stringify(req.body))
    //     
    //     passport.authenticate('local').then
    //     function (req, res)  {
    //         // console.log("error on login" + err)
    //         console.log('logged in', req);
    //         var userInfo = {
    //             username: req.user.username,
    //             name: req.user.name
    //         };
    //         res.send(userInfo);
    //     };
    // },


    update: function (req, res) {
        db
            .findOneAndUpdate({ _id: req.params.id }, req.body)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    // not going to be used yet, but here for later
    remove: function (req, res) {
        db
            .findById({ _id: req.params.id })
            .then(dbModel => dbModel.remove())
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
}