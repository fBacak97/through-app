const express = require("express");
const router = express.Router();

const Stream = require("../../models/Stream");
const User = require("../../models/User")

router.get('', async (req, res) => {
  const result = await User.find(req.query).populate({path: "stream", model: Stream});
  return res.json({result: result})
})

router.post('/change_title', async (req, res) => {
  User.findOne({name: req.body.username}).populate({path: "stream", model: Stream}).then((user) => {
    Stream.findOneAndUpdate({_id: user.stream._id}, {"title": req.body.title}).then((result, err) => {
      if(err){
        return res.json({result: "failure"})
      }else{
        return res.json({result: "success"})
      }
    })
  }); 
})

router.post('/change_tags', async (req, res) => {
  User.findOne({name: req.body.username}).populate({path: "stream", model: Stream}).then((user) => {
    Stream.findOneAndUpdate({_id: user.stream._id}, {"tags": req.body.tags}).then((result, err) => {
      if(err){
        return res.json({result: "failure"})
      }else{
        return res.json({result: "success"})
      }
    })
  }); 
})

router.post('/change_location', async (req, res) => {
  User.findOne({name: req.body.username}).populate({path: "stream", model: Stream}).then((user) => {
    Stream.findOneAndUpdate({_id: user.stream._id}, {"location": req.body.location}).then((result, err) => {
      if(err){
        return res.json({result: "failure"})
      }else{
        return res.json({result: "success"})
      }
    })
  }); 
})

router.post('/change_allowed_users', async (req, res) => {
  User.findOne({name: req.body.username}).populate({path: "stream", model: Stream}).then((user) => {
    Stream.findOneAndUpdate({_id: user.stream._id}, {"allowedUsers": req.body.allowedUsers}).then((result, err) => {
      if(err){
        return res.json({result: "failure"})
      }else{
        return res.json({result: "success"})
      }
    })
  }); 
})

router.post('/change_private', async (req, res) => {
  User.findOne({name: req.body.username}).populate({path: "stream", model: Stream}).then((user) => {
    Stream.findOneAndUpdate({_id: user.stream._id}, {"isPrivate": req.body.isPrivate}).then((result, err) => {
      if(err){
        return res.json({result: "failure"})
      }else{
        return res.json({result: "success"})
      }
    })
  }); 
})

router.post('/change_profession', async (req, res) => {
  User.findOneAndUpdate({name: req.body.username}, {"profession": req.body.profession}).then((user, err) => {
    if(err){
      return res.json({result: "failure"})
    }else{
      return res.json({result: "success"})
    }
  }); 
})

module.exports = router;