// require dependencies
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require('connect-mongo')(session)
const mongoose = require("mongoose");
const routes = require("./routes");

// setup port and express app method
const PORT = process.env.PORT || 3001;
const app = express();


// Define middleware here
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// We need to use sessions to keep track of our user's login status
app.use(session({ 
    secret: ["keyboard cat", "play chopsticks"], 
    resave: true, 
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// development and production errorhandling
// app.configure('development', function(){
//     app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
// });

// app.configure('production', function(){
//     app.use(express.errorHandler());
// });

// create static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
    app.use(express.static("rackers/build"));
}

// let express use the required routes.
app.use(routes)

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/rackeruserlist", { useNewUrlParser: true });

// Start the API server
app.listen(PORT, function() {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});