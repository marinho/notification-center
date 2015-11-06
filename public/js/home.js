$(document).on('ready', function(){
    notificationCenter = new NotificationCenter();
    notificationCenter.init();

    $('#list button').click(function(){
        $(this).toggleClass('paused');
        $(this).text($(this).is('.paused') ? 'Play' : "Pause");
    });
});
