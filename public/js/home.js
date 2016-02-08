$(document).on('ready', function(){
    notificationCenter = new NotificationCenter();
    notificationCenter.init();

    $('#list button').click(function () {
        $(this).toggleClass('paused');
        $(this).text($(this).is('.paused') ? 'Play' : "Pause");
    });

    $('#listenToChannel').click(function () {
        var button = $(this);
        var previousLabel = button.text();
        var channel = $.trim($('#channel').val());

        if (!channel) {
            alert('Channel must be a valid value');
            return;
        }

        $('#channel').val('');
        button.text('listening to ' + channel + '...');
        notificationCenter.listenToChannel(channel);
        setTimeout(function () {
            button.text(previousLabel);
        }, 2000);
    });
});
