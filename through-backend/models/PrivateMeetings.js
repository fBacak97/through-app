const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PrivateMeetingSchema = new Schema({
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  requestedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
    enum: ['pending', 'accepted', 'rejected']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  note: {
    type: String,
  }
});

module.exports = PrivateMeeting = mongoose.model("privateMeetings", PrivateMeetingSchema);