const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const StreamSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  location: {
    type: String,
    default: ""
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  allowedUsers: {
    type: [String],
    default: []
  }
});

module.exports = Stream = mongoose.model("streams", StreamSchema);