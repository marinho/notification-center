'use strict';

var express = require('express'),
    cors = require('cors'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    yaml = require('js-yaml'),
    fs = require('fs'),
    ioComm = require('./util/io_comm'),
    routes = require('./routes/index');

// Express application and HTTP server
var app = express();
var http = require('http').createServer(app);

// Loads service configuration
try {
    var configFileName = __dirname + '/config/config.yml';
    console.log('Loading config from ' + configFileName);
    app.config = yaml.safeLoad(fs.readFileSync(configFileName, 'utf8'));
    app.set('env', app.config.env || 'development');
} catch (e) {
    app.config = {
        'server': {
            'port': 5030
        },
        'websocket': {
            'allowedOrigins': '*:*' //'domain.com:* http://domain.com:* http://www.domain.com:*';
        },
        'push': {
            'securityToken': 'VeraLeniLeticia',
            'monitoringChannel': null // if containing a value, sends all notifications to this channel too
        }
    };
}

app.use(cors({
    origin: app.config.websocket.allowedOrigins
}));

// SocketIO setup
app.io = require('socket.io').listen(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

/* Socket.IO events */
app.io.on('connection', function (socket) {
    // Sent by browser just after connected
    socket.on('listenToChannel', function (data) {
        console.log('Session ' + data.sessionId + ' listening to Channel ' + data.channel);
        socket.join(data.channel);

        // Sends notification back
        ioComm.sendMessageToBrowser(app.io, 'notification', {}, data.channel);
    });
});

/// catch 404 and forward to error handler
app.use(function (req, res) {
    res.send(400, 'Not found');
});

// error handlers

app.use(function (err, req, res) {
    console.error(err.stack);
    if (app.get('env') === 'development') {
        res.status(500);
        res.render('error', { error: err });
    } else {
        res.status(500).send('Server Error');
    }
});

module.exports = http;
