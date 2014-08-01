## Examples with Curl

```
curl -X POST -d '{"channel": "123", "securityToken": "Vera", "bookings": []}' -H "Content-Type: application/json" http://localhost:3000/notification

curl -X POST -d '{"channel": "ABC", "securityToken": "Vera", "bookings": []}' -H "Content-Type: application/json" http://localhost:3000/notification

curl -X POST http://localhost:3000/ping
```

## On JS for browser

- add socket.io.js as a script tag

```
globals = {};
serverBaseUrl = document.domain;

function init() {
  globals.socket = io.connect(serverBaseUrl);
  globals.sessionId = '';

  globals.socket.on('connect', function () {
    globals.sessionId = globals.socket.io.engine.id;
    console.log('connected', globals.sessionId);

    // Listen to a channel. Can be moved to another function to call afterwards
    globals.socket.emit('listenToChannel', {"sessionId": globals.sessionId,
                                            "channel": channel});
  });

  globals.socket.on('ping', function (data) {
    console.log('ping', data.message);
  });

  globals.socket.on('notification', function (data) {
    console.log('notification', data);
  });
}

$(document).on('ready', init);
```
