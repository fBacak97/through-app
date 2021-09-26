const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    default: 'basic',
    enum: ['basic', 'admin']
  },
  status: {
    type: String,
    default: 'offline',
    enum: ['offline', 'live']
  },
  stream: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stream', 
    required: true,
  },
  profession: {
    type: String,
    default: ""
  }
});

module.exports = User = mongoose.model("users", UserSchema);