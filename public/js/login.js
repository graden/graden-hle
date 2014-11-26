$(function() {
    $('#button-submit').click(function() {
        var $username = $('#login-user').val();
        var $password = $('#password-user').val();
        $.ajax({url: "/login", method: "POST",
            data: {'username':$username, 'password':$password},
            success: function(){
                window.location.href = "/home";
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
    });

    $( "input[type=submit], button" ).button().click(function(event) {
        event.preventDefault();
    });

});

