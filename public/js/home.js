NotificationCenter = function(){
    this.channels = [];
    this.serverBaseUrl = document.domain;
}


NotificationCenter.prototype.init = function(){
    var _this = this;

    /* 
    On client init, try to connect to the socket.IO server.
    Note we don't specify a port since we set up our server
    to run on port 8080
    */
    _this.socket = io.connect(_this.serverBaseUrl);

    // We'll save our session ID in a variable for later
    _this.sessionId = '';

    /*
    When the client successfully connects to the server, an
    event "connect" is emitted. Let's get the session ID and
    log it.
    */
    _this.socket.on('connect', function(){
        _this.sessionId = _this.socket.io.engine.id;
        console.log('Connected ' + _this.sessionId);

        $.each(_this.channels, function(idx, ch){
            _this.listenToChannel(ch);
        });
    });

    _this.socket.on('ping', function (data) {
        $("<li>PING: " + JSON.stringify(data) + "</li>").appendTo("#list");
    });

    _this.socket.on('notification', function (data) {
        $("<li>NOTIFICATION: " + JSON.stringify(data) + "</li>").appendTo("#list");
    });
}


NotificationCenter.prototype.listenToChannel = function(channel) {
    console.log("Listening to " + channel);

    this.socket.emit('listenToChannel', {"sessionId": this.sessionId,
                                         "channel": channel});

    if ($.inArray(channel, this.channels) < 0)
        this.channels.push(channel);
}


$(document).on('ready', function(){
    notificationCenter = new NotificationCenter();
    notificationCenter.init();
});
