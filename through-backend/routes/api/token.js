const express = require("express");
const router = express.Router();
const RtcTokenBuilder = require('../../tokenBuilder/RtcTokenBuilder').RtcTokenBuilder
const RtcRole = require('../../tokenBuilder/RtcTokenBuilder').Role

const appID = "04fe97e28abf4969bbbfbc4cc7f24472";
const appCertificate = "0e6fdb5129204a07a5fd89e294caae46";
const expirationTimeInSeconds = 3600
const role = RtcRole.PUBLISHER

router.post('/fetch_rtc_token', (req, res) => {
    var currentTimestamp = Math.floor(Date.now() / 1000)
    var privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
    var channelName = req.body.channelName;

    // use 0 if uid is not specified
    var uid = req.body.uid || 0

    if (!channelName) {
        return res.status(400).json({ 'error': 'channel name is required' }).send();
    }

    var token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);

    res.header("Access-Control-Allow-Origin", "*")
    return res.json({ 'token': token }).send();
});

module.exports = router;