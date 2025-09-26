const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://anantanand900:anantanand900@cluster0.lx3wgs5.mongodb.net/moviesApp?retryWrites=true&w=majority&appName=Cluster0");

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false
  },
  isBlock: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;