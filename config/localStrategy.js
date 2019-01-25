const User = require('../models/user')
const LocalStrategy = require('passport-local').Strategy

const strategy = new LocalStrategy(
	{
		usernameField: 'username' // not necessary, DEFAULT
	},
	function(username, password, done) {
		// console.log("this ran passport before findone")
		// console.log("username = " + username)
		User.findOne({ username: username }, (err, user) => {
			// console.log("after this ran err = " + err)
			console.log("after this ran user = " + user)
			if (err) {
				console.log(err)
			}
			if (!user) {
				return done(null, false, console.log("incorrect username"))
			}
			if (!user.checkPassword(password)) {
				return done(null, false, console.log("incorrect password"))
			}
			// console.log("user to be sent after local =" +user)
			return done(null, user)
		})
	}
)

module.exports = strategy