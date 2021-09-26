const express = require("express");
const router = express.Router();

const User = require("../../models/User");
const PrivateMeeting = require("../../models/PrivateMeetings");

router.post("/request_private_meeting", (req, res) => {
  let requesteeUser = null;
  let requestedUser = null;
  User.findOne({ name: req.body.requestedBy }).then((user) => {
    requesteeUser = user;
    User.findOne({ name: req.body.requestedFrom }).then((user) => {
      requestedUser = user;
      const newPrivateMeetingRequest = new PrivateMeeting({
        requestedBy: requesteeUser,
        requestedFrom: requestedUser,
        note: req.body.note,
        title: req.body.title,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      });
      res.header("Access-Control-Allow-Origin", "*");
      newPrivateMeetingRequest
        .save()
        .then(() => res.json({ status: "success" }).send())
        .catch((err) => res.json({ status: err }).send());
    });
  });
});

router.get('', (req, res) => {
  User.findOne({name: req.query.username}).then((user) => {
    PrivateMeeting.find(req.query.status ? {requestedFrom: user, status: req.query.status} : {requestedFrom: user}).populate({path:'requestedBy', model: User}).populate({path:'requestedFrom', model: User}).then((pms) => {
      return res.json({result: pms});
    })
  })
})

router.post('/accept', (req, res) => {
  PrivateMeeting.findOneAndUpdate({_id: req.body.id},{"status": "accepted"}).then((result, err) => {
    if(err){
      return res.json({status: err})
    }
    else{
      return res.json({status: 'success'})
    }
  })
})

router.post('/reject', (req, res) => {
  PrivateMeeting.findOneAndUpdate({_id: req.body.id},{"status": "rejected"}).then((result, err) => {
    if(err){
      return res.json({status: err})
    }
    else{
      return res.json({status: 'success'})
    }
  })
})

module.exports = router;
