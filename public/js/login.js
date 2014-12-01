$(function() {
    function goUser(){
        var $username = $('#login-user').val();
        var $password = $('#password-user').val();
        $.ajax({url: "/login", method: "POST",
            data: {'username':$username, 'password':$password},
            success: function(data, textStatus, xhr){
                if (xhr.status == 201) {
                    var $id         = data;
                    $('#password-user').val('');
                    var $dialog     = $('#dialog-password');
                    $dialog.find('#password-new-user').val('');
                    $dialog.find('#password-retry-user').val('');
                    $dialog.dialog('option', 'title', 'Изменение пароля текущего пользователя');
                    $dialog.dialog('option', 'id', $id);
                    $dialog.dialog('open');
                } else {
                    window.location.href = "/home";
                }
            },
            complete: function() {
                stopLoadingAnimation();
            },
            error: function(jqXHR) {
                var $msgBox = $('#dialog-message');
                var error = JSON.parse(jqXHR.responseText);
                $('#txt-message').text(error.message);
                $msgBox.dialog('open');
            }
        });
    };

    $('#button-submit').click(function() {
        goUser();
    });

    $('#dialog-password').dialog({
        autoOpen: false, width: 400, modal: true, resizable: false,
        buttons: {
            'Ok': function() {
                var $id         = $(this).dialog('option', 'id');
                var $password1  = $(this).find('#password-new-user').val();
                var $password2  = $(this).find('#password-retry-user').val();
                var fsuccess    = null;
                var $dt         = {};
                var $msgBox     = $('#dialog-message');
                if ($password1 == $password2) {
                    if ($id) {
                        fsuccess = function(data) {
                        };
                        $dt = {'id':$id, 'password': $password1};
                        ajaxData('POST','/user/update/password', $dt, fsuccess);
                    } else {
                        $('#txt-message').text('У данной записи отсутствует ID');
                        $msgBox.dialog('open');
                    }
                } else {
                    $('#txt-message').text('Пароли не совпадают, повторите ввод');
                    $msgBox.dialog('open');
                }
                $(this).dialog('close');
            },
            'Отмена': function() {
                $(this).dialog('close');
            }
        },
        close: function() {$(this).dialog('close');}
    });

    $( "input[type=submit], button" ).button().click(function(event) {
        event.preventDefault();
    });

    $("#login-user").keypress(function(e){
        if(e.keyCode==13){
            goUser();
        }
    });

    $("#password-user").keypress(function(e){
        if(e.keyCode==13){
            goUser();
        }
    });

});

