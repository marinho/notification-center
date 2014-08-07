'use strict';

var express = require('express'),
    router = express.Router(),
    ioComm = require('../util/io_comm');


/* GET home page. */
router.get('/console', function (req, res) {
    res.render('index', { title: 'Notification Center' });
});


/* GET version */
router.get('/version', function (req, res) {
    res.json({ version: '0.1.1' });
});


/* GET helthcheck */
router.get('/healthcheck', function (req, res) {
    res.send('WORKING');
});


/* POST method to ping the browser sessions */
router.post('/ping', function (req, res) {
    var data = {};
    if (req.body.message) {
        data.message = req.body.message;
    }

    // Let our chatroom know there was a new message
    ioComm.sendMessageToBrowser(req.app.io, 'ping', data);

    // Looks good, let the client know
    res.send('SENT');
});


/* POST method to notification the browser sessions */
router.post('/notification', function (req, res) {
    // Paket validation
    if (!req.body.channel || !req.body.securityToken || req.body.securityToken !== req.app.config.push.securityToken) {
        res.send(400, 'Invalid paket');
        return;
    }

    var data = {};
    for (var k in req.body) {
        if (k !== 'channel' && k !== 'securityToken') {
            data[k] = req.body[k];
        }
    }

    // Let our chatroom know there was a new message
    ioComm.sendMessageToBrowser(req.app.io, 'notification', data, req.body.channel);

    // Send to monitoring channel
    if (req.app.config.push.monitoringChannel) {
        data.receivingChannel = req.body.channel;
        ioComm.sendMessageToBrowser(req.app.io, 'notification', data, req.app.config.push.monitoringChannel);
    }

    // Looks good, let the client know
    res.send('SENT');
});


module.exports = router;
