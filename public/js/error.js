$(function () {
    $('#dialog-permit').dialog({
        autoOpen: true, width: 360, modal: true, resizable: false,
        buttons: {
            'ОК': function() {
                history.back();
                $(this).dialog('close');
            }
        },
        close: function() {
            history.back();
            $(this).dialog('close');
        }
    });
});
