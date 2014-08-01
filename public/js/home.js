globals = {};
serverBaseUrl = document.domain;

function init() {
  /* 
   On client init, try to connect to the socket.IO server.
   Note we don't specify a port since we set up our server
   to run on port 8080
  */
  globals.socket = io.connect(serverBaseUrl);

  //We'll save our session ID in a variable for later
  globals.sessionId = '';

  /*
 When the client successfully connects to the server, an
 event "connect" is emitted. Let's get the session ID and
 log it.
  */
  globals.socket.on('connect', function () {
    globals.sessionId = globals.socket.io.engine.id;
    console.log('Connected ' + globals.sessionId);
  });

  globals.socket.on('ping', function (data) {
    var li = $("<li>PING</li>").appendTo("#list");
    if (data.message)
      li.append(": " + data.message);
  });

  globals.socket.on('notification', function (data) {
    var li = $("<li>NOTIFICATION: " + JSON.stringify(data).substr(0, 20) + "...</li>").appendTo("#list");
  });
}

function listenToChannel(channel) {
  globals.socket.emit('listenToChannel', {"sessionId": globals.sessionId,
                                          "channel": channel});
}

$(document).on('ready', init);
