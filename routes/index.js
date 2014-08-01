var express = require('express');
var router = express.Router();
var ioComm = require('../util/io_comm');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Notification Center' });
});

/* GET version */
router.get('/version', function(req, res) {
    res.json({ version: '0.1.0' });
});

/* GET helthcheck */
router.get('/healthcheck', function(req, res) {
    res.send("WORKING");
});

/* POST method to ping the browser sessions */
router.post("/ping", function(req, res) {
  var data = {};
  if (req.body.message)
    data.message = req.body.message;

  // Let our chatroom know there was a new message
  ioComm.sendMessageToBrowser(req.app.io, "ping", data);

  // Looks good, let the client know
  res.send("Ping Sent");
});

var SECURITY_TOKEN = "Vera";

/* POST method to ping the browser sessions */
router.post("/notification", function(req, res) {
  // Paket validation
  if (!req.body.channel || !req.body.securityToken || req.body.securityToken != SECURITY_TOKEN) {
    res.send(400, "Invalid paket");
    return;
  }

  var data = {};
  for (var k in req.body)
    if (k != "channel" && k != "securityToken")
      data[k] = req.body[k];

  // Let our chatroom know there was a new message
  ioComm.sendMessageToBrowser(req.app.io, "notification", data, req.body.channel);

  // Looks good, let the client know
  res.send("Notification Sent");
});

module.exports = router;
