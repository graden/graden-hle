$(function () {
    $.ajaxSetup({cache: false, timeout: 5000});

    $('#chart-tabs').tabs();
    $('#grid-tabs').tabs();
    $('#radio').buttonset();

    $(document).ready(function(){
        $('input').iCheck({
            checkboxClass: 'icheckbox_flat-orange',
            radioClass: 'iradio_flat-orange'
        });
    });

    FirstLoadHome();

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function FirstLoadHome() {
        var q = 0;
        var $quarter     = $.cookie('idQuarter');
        var $year        = $.cookie('idYear');
        var $idGrp       = $.cookie('idGrp');
        var $idObj       = $.cookie('idObj');

        var $radio       = $('#radio1').prop('checked');
        var txtPeriod    = ($radio) ? 'Квартал:': 'Полугодие:';
        var txtGroup     = ($radio) ? 'Объект:': 'Объект:';
        if (!$radio) {
            $quarter = ($quarter == 1 || $quarter == 2) ? 1 : 3;
            $.cookie('idQuarter', $quarter);
            q = ($quarter == 1) ? 1 : 2;
        } else {
            q = $quarter;
        }
        $('#name-quarter').text(txtPeriod);
        $('#name-object').text(txtGroup);
        $('#value-quarter').text(QuarterRome(q) + ', ' + $year + ' года.');
        UpdateHome($idGrp, $idObj, $year, $quarter, $radio);
    }

    function UpdateHome(idGrp, idObj, idYear, idQuarter, radioObj) {
        var fsuccess = function(data){
            //$('#name-group').text(data.nameGrp);
            //$('#name-object').text(data.nameObj);
            MarkContentLoad(data);
            TaskContentLoad(data);
            RptContentLoad(data);
            var setAllGroup  = $.cookie('setAllGroup');
            var setAllObject = $.cookie('setAllObject');

            if (setAllGroup == 'true') {
                $('#button-groups').button('disable');
            } else {
                $('#button-groups').button('enable');
            }
            if (setAllObject == 'true') {
                $('#button-object').button('disable');
            } else {
                $('#button-object').button('enable');
            }

            if (idGrp == '100000000000000000000001' || idObj == '100000000000000000000001') {
                $('#btn-chg-mark').button('disable');
                $('#btn-add-task').button('disable');
                $('#btn-chg-task').button('disable');
                $('#btn-del-task').button('disable');
            } else {
                $('#btn-chg-mark').button('enable');
                $('#btn-add-task').button('enable');
                $('#btn-chg-task').button('enable');
                $('#btn-del-task').button('enable');
            }
        };
        ajaxData('POST', '/home/update', {'idGrp':idGrp, 'idObj':idObj, 'idYear':idYear,
                 'idQuarter':idQuarter, 'radioObj':radioObj}, fsuccess);
    }

    function RptContentLoad(data) {
        var $content  = $('#tbl-report-body');
        var $tBody = $content.find('tbody:last');
        $content.find('tr').remove();
        $tBody.html(data.reports.list);
        FixTable($content);
        $('#tbl-report').find('tfoot th:eq(0) div').text(data.reports.count);
        //$(data.subjects.list).appendTo('#subject-list');
        //$("select").selectmenu("destroy").selectmenu({style:"dropdown", width: 220});
    }

    function TaskContentLoad(data) {
        var $content  = $('#tbl-task-body');
        var $tBody = $content.find('tbody:last');
        $content.find('tr').remove();
        $tBody.html(data.task.list);
        FixTable($content);
        $('#tbl-task').find('tfoot th:eq(0) div').text(data.task.count);
        $content  = $('#tbl-task-prev-body');
        $tBody = $content.find('tbody:last');
        $content.find('tr').remove();
        $tBody.html(data.taskPrev.list);
        FixTable($content);
        $('#tbl-task-prev').find('tfoot th:eq(0) div').text(data.taskPrev.count);
    }

    function MarkContentLoad(data){
        var $content  = $('#tbl-mark-body');
        var $tBody = $content.find('tbody:last');
        $content.find('tr').remove();
        $tBody.html(data.mark.list);
        FixTable($content);
        var $footTable = $('#tbl-mark').find('tfoot');
        $footTable.find('th:eq(0) div').text(data.mark.count);
        $footTable.find('th:eq(2) div').text(data.mark.avgDef);
        $footTable.find('th:eq(3) div').text(data.mark.avgPrev);
        radarChart(JSON.parse(data.radar));
    }

    $("#dialog-form-mark").dialog({
        autoOpen: false, width: 300, modal: true, resizable: false,
        dialogClass: 'no-dialog-padding',
        buttons: {
            "Сохранить": function() {
                var $idGrp      = $.cookie('idGrp');
                var $idObj      = $.cookie('idObj');
                var $idYear     = $.cookie('idYear');
                var $idQuarter  = $.cookie('idQuarter');
                var $radioObj   = $('#radio1').prop('checked');
                var $idCri      = $(this).dialog('option', 'idCri');
                var $idMark     = $(this).dialog('option', 'idMark');
                var $vMark      = $.trim($("#name-mark").val());
                if (isNumeric($vMark)) {
                    var fsuccess = function(data){
                        MarkContentLoad(data);
                    };
                    ajaxData('POST', '/mark/update', {'idYear':$idYear, 'idQuarter':$idQuarter,
                        'idObj':$idObj, 'idGrp':$idGrp, 'idCri':$idCri, 'idMark':$idMark ,
                        'vMark':$vMark, 'radioObj':$radioObj}, fsuccess);
                    $(this).dialog('close');
                } else {
                    var $msgBox = $('#dialog-message');
                    $('#txt-message').text("Необходимо ввести числовое значение!");
                    $msgBox.dialog('open');
                }
            },
            "Отмена": function() {$( this ).dialog('close');}
        },
        close: function() {$( this ).dialog( "close" );}
    });

    $('input[type=radio]').on('change', function(){
        FirstLoadHome();
    });

    $( "#dialog-form-tbl" ).dialog({
        autoOpen: false, width: 360, //height: 400,
        modal: true, resizable: false,
        dialogClass: 'no-dialog-padding',
        buttons: {
            "Ok": function() {
                var $type         = $(this).dialog('option', 'type');
                var $content      = $(this).dialog('option', 'content');
                var $highlight    = $content.find('tr.hle-grid-highlight');
                var $idGrp        = $.cookie('idGrp');
                var $idObj        = $.cookie('idObj');
                var $idYear       = $.cookie('idYear');
                var $idQuarter    = $.cookie('idQuarter');
                var $radioObj     = $('#radio1').prop('checked');

                if ($type == 'groups') {
                    $idGrp = $highlight.attr('data-id');
                    var $nameGrp = $highlight.find('td:eq(1)').text();
                    $.cookie('idGrp', $idGrp);
                    $('#value-group').text($nameGrp);
                }
                if ($type == 'object') {
                    $idObj = $highlight.attr('data-id');
                    var $nameObj = $highlight.find('td:eq(1)').text();
                    $.cookie('idObj', $idObj);
                    $('#value-object').text($nameObj);
                }

                UpdateHome($idGrp, $idObj, $idYear, $idQuarter, $radioObj);
                $( this ).dialog( "close" );
            },
            "Отмена": function() {$( this ).dialog( "close" );}
        },
        close: function() {$( this ).dialog( "close" );}
    });

    $( "#btn-setting").click(function() {
        var fsuccess = function(data){
            if (data) {
                location.href = data.url;
            }
        };
        ajaxData('GET', '/setting/permit',{}, fsuccess);

    });

    $( "#btn-chg-mark").click(function() {
        var $content = $('#tbl-mark-body');
        var $highlight = $content.find('tr.hle-grid-highlight');
        var $id = $highlight.attr('data-id');
        if ($id == '') {
            var $msgBox = $('#dialog-message');
            $('#txt-message').text('Отсутствуют данные в таблице')
            $msgBox.dialog('option', 'title', 'Сообщение об ошибке...');
            $msgBox.dialog('open');
            return;
        }
        var $idMark = $highlight.attr('data-id-mark');
        var $vMark  = $highlight.find('td:eq(2) div').text();
        $('#name-mark').val($vMark);
        var $dialog = $('#dialog-form-mark');
        $dialog.dialog('option', 'idMark', $idMark);
        $dialog.dialog('option', 'idCri', $id);
        $dialog.dialog('option', 'title', 'Оценка компитенции');
        $dialog.dialog( "open" );
    });

    $("#btn-exe-report").click(function() {
        var $idGrp        = $.cookie('idGrp');
        var $idObj        = $.cookie('idObj');
        var $idYear       = $.cookie('idYear');
        var $idQuarter    = $.cookie('idQuarter');
        var $radioObj     = $('#radio1').prop('checked');
        var $content      = $('#tbl-report-body');
        var $highlight    = $content.find('tr.hle-grid-highlight');
        var $url          = $highlight.attr('data-url');
        var fsuccess = function(data){
            if (data) {
                location.href = '/download?path=' + data;
            }
        };
        ajaxData('POST', $url, {'idGrp': $idGrp, 'idObj': $idObj,
            'idYear': $idYear, 'idQuarter': $idQuarter, 'radioObj':$radioObj}, fsuccess);
    });

    $("#button-object").click(function() {
        var $content = $('#tbl-sprav-body');
        var $tBody = $content.find('tbody:last');
        var fsuccess = function(data){
            if (data) {
                $content.find('tr').remove();
                $tBody.html(data.list);
                $('#tbl-sprav').find('tfoot th:eq(0) div').text(data.count);
                var $dialog = $('#dialog-form-tbl');
                $dialog.dialog('option', 'type', 'object');
                $dialog.dialog('option', 'title', 'Объекты оценки');
                $dialog.dialog('option', 'content', $content);
                $dialog.dialog('open');
                FixTable($content);
            }
        };
        ajaxData('GET', '/object/listRole', {}, fsuccess);
    });

    $("#button-groups").click(function() {
        var $content = $("#tbl-sprav-body"); var $i=0;
        var $tBody = $content.find('tbody:last');
        var fsuccess = function(data){
            if (data) {
                $content.find('tr').remove();
                $tBody.html(data.list);
                $('#tbl-sprav').find('tfoot th:eq(0) div').text($i);
                var $dialog = $('#dialog-form-tbl');
                $dialog.dialog('option', 'type', 'groups');
                $dialog.dialog('option', 'title', 'Группы направлений');
                $dialog.dialog('option', 'content', $content);
                $dialog.dialog('open');
                FixTable($content);
            }
        };
        ajaxData('GET', '/crigroup/listRole', {}, fsuccess);
    });

    $('#button-logout').click(function() {
        document.location.href = '/logout';
    });

    $('#button-quarter-minus').click(function(){
        var $idYear       = $.cookie('idYear');
        var $idQuarter    = $.cookie('idQuarter');
        var $radioObj     = $('#radio1').prop('checked');
        parseInt($idYear);
        parseInt($idQuarter);
        var $a = QuarterHalfYear('minus', $radioObj, $idQuarter, $idYear);
        UpdateHome($.cookie('idGrp'), $.cookie('idObj'), $a.year, $a.quarter, $radioObj);
    });

    $('#button-quarter-plus').click(function(){
        var $idYear       = $.cookie('idYear');
        var $idQuarter    = $.cookie('idQuarter');
        var $radioObj     = $('#radio1').prop('checked');
        parseInt($idYear);
        parseInt($idQuarter);
        var $a = QuarterHalfYear('plus', $radioObj, $idQuarter, $idYear);
        UpdateHome($.cookie('idGrp'), $.cookie('idObj'), $a.year, $a.quarter, $radioObj);
    });



    $('#btn-add-task').click(function() {
        var $content = $('#tbl-task-body');
        $('#task-value').val('');
        $('#task-percent').val('');

        var $dialog = $('#dialog-form-task');
        $dialog.dialog('option', 'title', 'Добавить новую задачу');
        $dialog.dialog('option', 'id', null);
        $dialog.dialog('option', 'content', $content);
        $dialog.dialog('option', 'type', 'create');
        $dialog.dialog( "open" );
    });

    $('#btn-chg-task').click(function() {
        var $content   = $('#tbl-task-body');
        var $highlight = $content.find('tr.hle-grid-highlight');
        var $id        = $highlight.attr('data-id');
        if ($id) {
            var $value     = $highlight.find('td:eq(1) div').text();
            var $percent   = $highlight.find('td:eq(2) div').text();
            $('#task-value').val($value);
            $('#task-percent').val($percent);

            var $dialog = $('#dialog-form-task');
            $dialog.dialog('option', 'title', 'Изменить текущую задачу');
            $dialog.dialog('option', 'id', $id);
            $dialog.dialog('option', 'content', $content);
            $dialog.dialog('option', 'type', 'update');
            $dialog.dialog( "open" );
        }
    });

    $('#btn-del-task').click(function() {
        var $content   = $('#tbl-task-body');
        var $highlight = $content.find('tr.hle-grid-highlight');
        var $id        = $highlight.attr('data-id');
        if ($id) {
            var $fsuccess  = function() {
                $highlight.remove();
                FixTable($content);
            };
            var $dialog  = $('#dialog-remove');
            $dialog.find('#txt-message').text("Вы хотите удалить задачу?");
            $dialog.dialog('option', 'title', 'Подтверждение удаления');
            $dialog.dialog('option', 'url', "/task/remove");
            $dialog.dialog('option', 'data', {'id': $id});
            $dialog.dialog('option', 'fsuccess', $fsuccess);
            $dialog.dialog('open');
        }
    });

    $( "#dialog-form-task" ).dialog({
        autoOpen: false, width: 400, modal: true, resizable: false,
        dialogClass: 'no-dialog-padding',
        buttons: {
            "Ok": function() {
                var $idGrp      = $.cookie('idGrp');
                var $idObj      = $.cookie('idObj');
                var $idYear     = $.cookie('idYear');
                var $idQuarter  = $.cookie('idQuarter');
                var $id         = $(this).dialog('option', 'id');
                var $content    = $(this).dialog('option', 'content');
                var $highlight  = $content.find('tr.hle-grid-highlight');
                var $type       = $(this).dialog('option', 'type');
                var $radioObj   = $('#radio1').prop('checked');
                var $data       = {};
                var $value      = $.trim($(this).find('#task-value').val());
                var $percent    = $.trim($(this).find('#task-percent').val());
                if (isNumeric($percent)) {
                    if ($type == 'create') {
                        $data = {
                            'idYear': $idYear, 'idQuarter': $idQuarter,
                            'idObj': $idObj, 'idGrp': $idGrp, 'taskValue': $value,
                            'taskPercent': $percent, 'radioObj': $radioObj
                        };
                        var $fsuccess = function (data) {
                            AddTrTable($content);
                            var $i = $content.find('tr:last-child td:eq(0) div').text();
                            var $tBody = $content.find('tbody:last');
                            parseInt($i);
                            $i++;
                            $tBody.append('<tr data-id="' + data._id + '">' +
                                '<td class="td-1"><div>' + $i + '</div></td>' +
                                '<td class="td-2"><div>' + data.valueTask + '</div></td>' +
                                '<td class="td-3"><div>' + data.percentTask.toFixed(2) + '</div></td>' +
                                '</tr>'
                            );
                            FixTable($content);
                        };
                    }
                    if ($type == 'update') {
                        $data = {
                            'id': $id, 'idYear': $idYear, 'idQuarter': $idQuarter,
                            'idObj': $idObj, 'idGrp': $idGrp, 'taskValue': $value,
                            'taskPercent': $percent, 'radioObj': $radioObj
                        };
                        $fsuccess = function (data) {
                            if (data) {
                                if ($id === $highlight.attr('data-id')) {
                                    $highlight.find('td:eq(1) div').text(data.valueTask);
                                    $highlight.find('td:eq(2) div').text(data.percentTask.toFixed(2));
                                }
                            }
                        };
                    }
                    ajaxData('POST', '/task/' + $type, $data, $fsuccess);
                    $(this).dialog('close');
                } else {
                    var $msgBox = $('#dialog-message');
                    $msgBox.find('#txt-message').text("Необходимо ввести числовое значение!");
                    $msgBox.dialog('open');
                }
            },
            "Отмена": function() {$( this ).dialog('close');}
        },
        close: function() {$( this ).dialog( "close" );}
    });

    $("input[type=submit], button").button().click(function(event) {
        event.preventDefault();
    });

    $("button").focus(function () {
        $(this).removeClass("ui-state-focus");
    });

    $('input, textarea').addClass("ui-corner-all");

    /*$('#subject-list').selectmenu({
        width: 220
    });*/


});


