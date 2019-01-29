import axios from "axios";

export default {
  // Gets all Users
  getUsers: function() {
    return axios.get("/api/users/");
  },
  getUsersbyHighscore: function() {
    return axios.get("/api/users/high-score");
  },
  // Gets the User with the given id
  getUser: function(id) {
    return axios.get("/api/users/" + id);
  },
  // Deletes the User with the given id
  deleteUser: function(id) {
    return axios.delete("/api/users/" + id);
  },
  // Saves a User to the database
  signUpUser: function(userData) {
    return axios.post("/api/users", userData);
  },
  signInUser: function(userData) {
    return axios.post("/api/users", userData);
  }
};
