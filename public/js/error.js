$(function () {
    $('#dialog-permit').dialog({
        autoOpen: true, width: 360, modal: true, resizable: false,
        buttons: {
            'ОК': function() {
                $(this).dialog('close');
            }
        },
        close: function() {$(this).dialog('close');}
    });
});
