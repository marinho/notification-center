NotificationCenter = function(){
    this.channels = [];
    this.serverBaseUrl = document.domain;
}


NotificationCenter.prototype.init = function(){
    var _this = this;

    _this.socket = io.connect(_this.serverBaseUrl);
    _this.sessionId = '';

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
