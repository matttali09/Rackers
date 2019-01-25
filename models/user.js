const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// passport local package for easier mongoose passport setup
const bcrypt = require('bcryptjs');


const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true},
  password: { type: String, required: true, unique: false },
  age: { type: Number, default: 18 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});


// Define schema methods
userSchema.methods = {
  checkPassword: function (inputPassword) {
    console.log("check password ran")
    return (inputPassword, this.password)
  },
  hashPassword: plainTextPassword => {
    return bcrypt.hashSync(plainTextPassword, 10)
  }
}

// Define hooks for pre-saving
userSchema.pre('save', function (next) {
  console.log(this)
  if (!this.password) {
    console.log('models/user.js =======NO PASSWORD PROVIDED=======')
    next()
  } else {
    
    console.log('models/user.js hashPassword in pre save');
    this.password = this.hashPassword(this.password)
    console.log("this after hash = " + this) 

    next()
  }
})

// create the User export based off the schema and plugin
const User = mongoose.model("User", userSchema);

module.exports = User;