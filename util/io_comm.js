'use strict';

var ioComm = {
    sendMessageToBrowser: function (io, eventName, data, channel) {
        // Adds server time
        data.serverTime = (new Date()).toISOString(); // UTC time, ISO format

        if (!channel) {
            io.emit(eventName, data);
        } else {
            io.to(channel).emit(eventName, data);
        }
    }
};

module.exports = ioComm;
