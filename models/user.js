const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// passport local package for easier mongoose passport setup
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  username: { type: String, required: true, unique: true},
  name: { type: String, default: "tali"},
  password: { type: String, required: true, unique: false },
  age: { type: Number, default: 18 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

// use the mongoose pluggin localstrategy
userSchema.plugin(passportLocalMongoose);

// create the User export based off the schema and plugin
const User = mongoose.model("User", userSchema);

module.exports = User;