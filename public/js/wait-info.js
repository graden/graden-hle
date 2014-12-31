jQuery.fn.extend({
    disable: function(state) {
        return this.each(function() {
            this.disabled = state;
        });
    }
});

function startLoadingAnimation() {
    $('#wait-info').dialog('open');
}

function stopLoadingAnimation(){
    $('#wait-info').dialog('close');
}

function ajaxData(type, url, data, fsuccess){
    startLoadingAnimation();
    $.ajax({url: url, method: type , data: data,
        success: fsuccess,
        complete: function() {
            stopLoadingAnimation();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            stopLoadingAnimation();
            var textError = ajax_error_working_mes(jqXHR, errorThrown);
            var $msgBox = $('#dialog-message');
            $('#txt-message').text(textError);
            $msgBox.dialog('open');
        }
    });
}

$(function () {
    $("#wait-info").dialog({
        open:function() {
            $(this).parents(".ui-dialog:first").find(".ui-dialog-titlebar").remove();
        },
        autoOpen: false, minHeight: 10, minWidth: 100, width: 300, modal: true, resizable: false
    });

    $("#dialog-message-role").dialog({
        autoOpen: false, minHeight: 50, width: 300, modal: true, resizable: false,
        buttons: {
            "Ok": function() {
                window.location.href = "/home";
                $( this ).dialog("close");
            }
        },
        close: function() {$( this ).dialog("close");}
    });

    $("#dialog-message").dialog({
        autoOpen: false, minHeight: 50, width: 300, modal: true, resizable: false,
        buttons: {
            "Закрыть": function() {
                $( this ).dialog("close");
            }
        },
        close: function() {$( this ).dialog("close");}
    });

    $("#dialog-remove").dialog({
        autoOpen: false, minHeight: 50, minWidth: 100, modal: true, resizable: false,
        buttons: {
            "Да": function() {
                var $url        = $(this).dialog('option', 'url');
                var $fsuccess   = $(this).dialog('option', 'fsuccess');
                var $data       = $(this).dialog('option', 'data');
                startLoadingAnimation();
                $.ajax({url: $url, method: "POST", data: $data,
                    success: $fsuccess,
                    complete: function() {
                        stopLoadingAnimation();
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        stopLoadingAnimation();
                        var textError = ajax_error_working_mes(jqXHR, errorThrown);
                        var $msgBox = $('#dialog-message');
                        $msgBox.find('#txt-message').text(textError);
                        $msgBox.dialog('open');
                    }
                });
                $(this).dialog("close");
            },
            "Нет": function() {
                $(this).dialog("close");
            }
        },
        close: function() {$( this ).dialog("close");}
    });
});

function parse_text_htmlspch(str) {
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/"/g, '&quot;');

    return str;
}

function ajax_error_working_mes(jqXHR, errorThrown) {
    var message = '';
    if(jqXHR.status !== undefined && jqXHR.status !== null && jqXHR.status !== 0) {
        var error = JSON.parse(jqXHR.responseText);
        //message = 'Ошибка '+jqXHR.status;
        if(error.message.length > 1) {
            message = error.message;
        } else {
            message = 'Пожалуйста, повторите операцию';
        }
    } else {
        if(errorThrown.length > 1){
            message = 'Ошибка: '+errorThrown;
        } else {
            message = 'Ошибка запроса.';
        }
    }
    return message;
}

function QuarterHalfYear(type, radio, quarter, year) {
    var a = {}; var q = 0;
    if (type == 'plus') {
        if (radio) {
            if (quarter < 4) {
                quarter++;
            }  else {
                year++;
                quarter = 1;
            }
        } else {
            quarter = (quarter == 1 || quarter == 2) ? 1 : 3;
            if (quarter < 3) {
                quarter += 2;
            }  else {
                year++;
                quarter = 1;
            }
        }
    } else {
        if (radio) {
            if (quarter > 1) {
                quarter -= 1;
            }  else {
                year -= 1;
                quarter = 4;
            }
        } else {
            quarter = (quarter == 1 || quarter == 2) ? 1 : 3;
            if (quarter > 1) {
                quarter -= 2;
            }  else {
                year -= 1;
                quarter = 3;
            }
        }
    }
    a.quarter = quarter;
    a.year = year;
    $.cookie('idQuarter', quarter);
    $.cookie('idYear', year);
    if (!radio) {
        q = (quarter == 1 || quarter == 2) ? 1 : 2;
    } else {
        q = quarter;
    }
    $('#value-quarter').text(QuarterRome(q) + ', ' + year + ' года.');
    return a;
}
