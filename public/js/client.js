NotificationCenter = function(){
    this.channels = [];
    this.serverBaseUrl = document.domain;
    this.totalCount = 0;
    this.receivedChannels = {};
    this.initialTime = new Date();
    $('#initialTime').text(this.initialTime.toTimeString());
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
        _this.addNotificationToList("PING", data);
    });

    _this.socket.on('notification', function (data) {
        _this.addNotificationToList("NOTIFICATION", data);

        // Total messages
        _this.totalCount++;
        $("#totalCount>.value").text(_this.totalCount);

        // Average per second
        var now = new Date();
        var delta = Math.ceil((now.getTime() - _this.initialTime.getTime()) / 60000);
        var perMinute = _this.totalCount / delta;
        $("#perMinute>.value").text(perMinute.toFixed(0));

        // Received channels
        if (data.receivingChannel) {
            if (!_this.receivedChannels[data.receivingChannel]) {
                _this.receivedChannels[data.receivingChannel] = 1;
            } else {
                _this.receivedChannels[data.receivingChannel]++;
            }
        }
        for (var k in _this.receivedChannels) {
            var v = _this.receivedChannels[k];
            var container = $('#channels li#' + k);
            if (container.length == 0) {
                container = $('<li id="' + k + '">' + k + ': <span class="value"></span></li>').appendTo('#channels ul');
            }

            container.find(".value").text(v);
        }
    });
}


NotificationCenter.prototype.listenToChannel = function(channel) {
    console.log('Listening to ' + channel);

    this.socket.emit('listenToChannel', {"sessionId": this.sessionId,
                                         "channel": channel});

    if ($.inArray(channel, this.channels) < 0)
        this.channels.push(channel);
}


NotificationCenter.prototype.addNotificationToList = function(type, data) {
    if ($('#list button').is('.paused')) {
        return;
    }

    $("<li>" + type + ": " + JSON.stringify(data) + "</li>").appendTo("#list ol");

    // Keeps always 50 or less notifications
    while ($("#list li").length > 50) {
        $("#list li:first-child").remove();
    }
}
