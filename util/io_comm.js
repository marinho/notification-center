var ioComm = {
    sendMessageToBrowser: function (io, eventName, data, channel){
        if (!channel)
            io.emit(eventName, data)
        else
            io.to(channel).emit(eventName, data);
    }
}

module.exports = ioComm;
