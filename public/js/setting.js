$(function () {
    $('#page-wrapper').tabs();


    $(document).ready(function(){
        $('input').iCheck({
            checkboxClass: 'icheckbox_minimal-orange',
            radioClass: 'iradio_minimal-orange',
            increaseArea: '20%' // optional
        });
    });

    $.ajaxSetup({cache: false});

    $( "#btn-back").click(function() {
        document.location.href = "/home";
    });

    function GroupContentLoad(id, typeObj) {
        var fsuccess = function(data){
            var $content = $('#tbl-cri-group-content-body');
            var $i=0;
            var $tBody = $content.find('tbody:last');
            $content.find('tr').remove();
            $.each(data, function(key, val){
                $i++;
                $tBody.append('<tr data-id="' + val._id + '">' +
                    '<td class="td-1"><div>' + $i + '</div></td>'+
                    '<td class="td-2"><div>' + val.name+ '</div></td>' +
                    '</tr>'
                );
            });
            FixTable($content);
            $content = $('#tbl-cri-group-content-footer');
            $content.find('th:eq(0) div').text($i);
        };
        ajaxData('POST', '/crigroupcontent/list', {'id':id, 'typeObj':typeObj}, fsuccess);
    }

    /* погрузка данных в 'data-cri-group-content' при изменение фокуса 'data-cri-group'  */

    function SubjectContentLoad(id) {
        var fsuccess = function(data){
            var $content = $('#tbl-subject-body');
            var $i=0;
            var $tBody = $content.find('tbody:last');
            $content.find('tr').remove();
            $.each(data, function(key, val){
                $i++;
                $tBody.append('<tr data-id=' + val._id + ' data-id-obj=' + val.idObj + '>' +
                    '<td class="td-1"><div>' + $i + '</div></td>'+
                    '<td class="td-2"><div>' + val.fName+ '</div></td>' +
                    '</tr>'
                );
            });
            FixTable($content);
            $content = $('#tbl-subject-footer');
            $content.find('th:eq(0) div').text($i);
        };
        ajaxData('POST', '/subject/list', {'id':id}, fsuccess);
    }


    $('#radio-obj').on('ifChanged',function(){
        var $content = $('#tbl-cri-group-body').find('tr.hle-grid-highlight');
        var $id = $content.attr('data-id');
        var $radioObj = $('#radio-obj').prop('checked');
        GroupContentLoad($id, $radioObj);
    });

    $('#tbl-cri-group-body').on('click', 'tr', function(){
        var $id = $(this).attr('data-id');
        var $radioObj = $('#radio-obj').prop('checked');
        GroupContentLoad($id, $radioObj);
    });

    $('#tbl-object-body').on('click', 'tr', function(){
        var $id = $(this).attr('data-id');
        SubjectContentLoad($id);
    });

    $('#dialog-cri-list').dialog({
        autoOpen: false, width: 360, modal: true, resizable: false,
        buttons: {
            'Добавить': function() {
                var $content   = $('#tbl-cri-list-body');
                var $highlight = $content.find('tr.hle-grid-highlight');
                var $idCri     = $highlight.attr('data-id');
                var $idGrp     = $(this).dialog('option', 'idGrp');
                var $radioObj  = $('#radio-obj').prop('checked');
                if ($idCri && $idGrp) {
                    var fsuccess = function(){
                        GroupContentLoad($idGrp, $radioObj);
                    };
                    ajaxData('POST', '/crigroupcontent/add',
                        {'typeObj':$radioObj, 'id':$idGrp, 'idCri':$idCri}, fsuccess);
                    $(this).dialog('close');
                } else {
                    var $msgBox = $('#dialog-message');
                    var $txt = 'Отсуствует ID Критерия или ID группы';
                    $('#txt-message').text($txt);
                    $msgBox.dialog('open');
                }
            },
            'Отмена': function() {
                $(this).dialog('close');
            }
        },
        close: function() {$(this).dialog('close');}
    });

    $('#button-del-cri-group-content').click(function() {
        var $contentGrp = $('#tbl-cri-group-body').find('tr.hle-grid-highlight');
        var $contentCri = $('#tbl-cri-group-content-body').find('tr.hle-grid-highlight');
        var $idGrp = $contentGrp.attr("data-id");
        var $idCri = $contentCri.attr("data-id");
        var $radioObj = $('#radio-obj').prop('checked');
        if ($idCri && $idGrp) {
            var $fsuccess = function() {
                GroupContentLoad($idGrp, $radioObj);
            };
            var $dialog  = $('#dialog-remove');
            $dialog.find('#txt-message').text("Вы хотите исключить данный критерий из группы?");
            $dialog.dialog('option', 'title', 'Подтверждение удаления');
            $dialog.dialog('option', 'url', "/crigroupcontent/remove");
            $dialog.dialog('option', 'data', {'typeObj':$radioObj,'id':$idGrp,'idCri':$idCri});
            $dialog.dialog('option', 'fsuccess', $fsuccess);
            $dialog.dialog('open');
        } else {
            var $msgBox = $('#dialog-message');
            $('#txt-message').text('Отсуствует ID Критерия или ID группы');
            $msgBox.dialog('open');
        }
    });

    $('#button-add-cri-group-content').click(function() {
        var $content    = $('#tbl-cri-group-body');
        var $highlight  = $content.find('tr.hle-grid-highlight');
        var $idGrp      = $highlight.attr('data-id');
        var $radioObj   = $('#radio-obj').prop('checked');
        var fsuccess    = null;
        if ($idGrp) {
            fsuccess = function(data){
                $content = $('#tbl-cri-list-body');
                $content.find('tr').remove();
                var $i=0;
                var $txtBody = '';
                var $tBody = $content.find('tbody:last');
                $.each(data, function(key, val){
                    $i++;
                    $txtBody += '<tr data-id="' + val._id + '">' +
                        '<td class="td-1"><div>' + $i + '</div></td>'+
                        '<td class="td-2"><div>' + val.name+ '</div></td>'+
                        '</tr>';
                });
                $tBody.html($txtBody);
                $('#tbl-cri-list').find('tfoot th:eq(0) div').text($i);
                var $dialog = $('#dialog-cri-list');
                $dialog.dialog('option', 'idGrp', $idGrp);
                $dialog.dialog('option', 'title', 'Добавить в группу критерий');
                $dialog.dialog('open');
                FixTable($content);
            };
            ajaxData('POST', '/crigroupcontent/choice', {'typeObj':$radioObj, 'id':$idGrp}, fsuccess);
        } else {
            var $msgBox = $('#dialog-message');
            $('#txt-message').text("отсутствует ID записи");
            $msgBox.dialog('open');
        }
    });

    $('#button-add-subject').click(function() {
        var $content   = $('#tbl-object-body');
        var $highlight = $content.find('tr.hle-grid-highlight');
        var $id        = $highlight.attr('data-id');
        var $dialog    = $('#dialog-subject');
        $dialog.find('#fName-subject').val('');
        $dialog.find('#sName-subject').val('');
        $dialog.find('#tName-subject').val('');
        $dialog.dialog('option', 'title', 'Добавить нового субъекта');
        $dialog.dialog('option', 'type', 'create');
        $dialog.dialog('option', 'idObj', $id);
        $content = $('#tbl-subject-body');
        $dialog.dialog('option', 'content', $content);
        $dialog.dialog('open');
    });

    $('#button-edit-subject').click(function() {
        var $content = $('#tbl-subject-body');
        var $highlight  = $content.find('tr.hle-grid-highlight');
        var $idSbj = $highlight.attr('data-id');
        var $idObj = $highlight.attr('data-id-obj');
        var $dialog = $('#dialog-subject');
        var $fName = $highlight.find('td:eq(2) div').text();
        var $sName = $highlight.find('td:eq(3) div').text();
        var $tName = $highlight.find('td:eq(4) div').text();
        $dialog.find('#fName-subject').val($fName);
        $dialog.find('#sName-subject').val($sName);
        $dialog.find('#tName-subject').val($tName);
        var $name = $fName + ' ' + $sName.charAt(0) + '.' + $tName.charAt(0) + '.';
        $dialog.dialog('option', 'title', 'Изменить субъекта');
        $dialog.dialog('option', 'idObj', $idObj);
        $dialog.dialog('option', 'idSbj', $idSbj);
        $dialog.dialog('option', 'type', 'update');
        $dialog.dialog('option', 'content', $content);
        $dialog.dialog('option', 'name', $name);
        $dialog.dialog('open');
    });

    $('#button-add-object').click(function() {
        var $table     = $('#tbl-object');
        var $content   = $('#tbl-object-body');
        var $dialog    = $('#dialog-cri');
        $dialog.find('#name-cri').val('');
        $dialog.dialog('option', 'title', 'Добавить объект');
        $dialog.dialog('option', 'url', 'object');
        $dialog.dialog('option', 'type', 'create');
        $dialog.dialog('option', 'content', $content);
        $dialog.dialog('option', 'table', $table);
        $dialog.dialog('open');
    });

    $('#button-edit-object').click(function() {
        var $table     = $('#tbl-object');
        var $content   = $('#tbl-object-body');
        var $highlight = $content.find('tr.hle-grid-highlight');
        var $id        = $highlight.attr('data-id');
        var $name      = $highlight.find('td:eq(1) div').text();
        var $dialog    = $('#dialog-cri');
        $dialog.find('#name-cri').val($name);
        $dialog.dialog('option', 'title', 'Изменить объект');
        $dialog.dialog('option', 'id', $id);
        $dialog.dialog('option', 'url', 'object');
        $dialog.dialog('option', 'type', 'update');
        $dialog.dialog('option', 'content', $content);
        $dialog.dialog('option', 'table', $table);
        $dialog.dialog('open');
    });

    $('#button-add-cri-group').click(function() {
        var $table     = $('#tbl-cri-group');
        var $content   = $('#tbl-cri-group-body');
        var $dialog    = $('#dialog-cri');
        $dialog.dialog('option', 'title', 'Добавить группу');
        $dialog.dialog('option', 'url', 'crigroup');
        $dialog.dialog('option', 'type', 'create');
        $dialog.dialog('option', 'content', $content);
        $dialog.dialog('option', 'table', $table);
        $dialog.dialog('open');
    });

    $('#button-edit-cri-group').click(function() {
        var $table     = $('#tbl-cri-group');
        var $content   = $('#tbl-cri-group-body');
        var $highlight = $content.find('tr.hle-grid-highlight');
        var $id        = $highlight.attr('data-id');
        var $name      = $highlight.find('td:eq(1) div').text();
        var $dialog    = $('#dialog-cri');
        $dialog.find('#input-text-cri').val($name);
        $dialog.dialog('option', 'title', 'Изменить группу');
        $dialog.dialog('option', 'id', $id);
        $dialog.dialog('option', 'url', 'crigroup');
        $dialog.dialog('option', 'type', 'update');
        $dialog.dialog('option', 'content', $content);
        $dialog.dialog('option', 'table', $table);
        $dialog.dialog('open');
    });

    $('#button-del-object').click(function() {
        var $content   = $('#tbl-object-body');
        var $highlight = $content.find('tr.hle-grid-highlight');
        var $id        = $highlight.attr('data-id');
        var $fsuccess  = function() {
            $highlight.remove();
            FixTable($content);
        };
        var $dialog    = $('#dialog-remove');
        $dialog.find('#txt-message').text("Вы хотите удалить данный объект?");
        $dialog.dialog('option', 'title', 'Подтверждение удаления');
        $dialog.dialog('option', 'url', "/object/remove");
        $dialog.dialog('option', 'data', {'id':$id});
        $dialog.dialog('option', 'fsuccess', $fsuccess);
        $dialog.dialog('open');
    });

    $('#button-add-cri').click(function() {
        var $table      = $('#tbl-cri');
        var $content    = $('#tbl-cri-body');
        var $dialog     = $('#dialog-cri');
        $dialog.find('#name-cri').val('');
        $dialog.dialog('option', 'title', 'Добавить критерий');
        $dialog.dialog('option', 'type', 'create');
        $dialog.dialog('option', 'url', 'cri');
        $dialog.dialog('option', 'content', $content);
        $dialog.dialog('option', 'table', $table);
        $dialog.dialog('open');
    });

    $('#button-edit-cri').click(function() {
        var $table      = $('#tbl-cri');
        var $content    = $('#tbl-cri-body');
        var $highlight  = $content.find('tr.hle-grid-highlight');
        var $id         = $highlight.attr('data-id');
        var $name       = $highlight.find('td:eq(1) div').text();
        var $dialog     = $('#dialog-cri');
        $dialog.find('#name-cri').val($name);
        $dialog.dialog('option', 'title', 'Изменить критерий');
        $dialog.dialog('option', 'id', $id);
        $dialog.dialog('option', 'type', 'update');
        $dialog.dialog('option', 'url', 'cri');
        $dialog.dialog('option', 'content', $content);
        $dialog.dialog('option', 'table', $table);
        $dialog.dialog('open');
    });

    $('#button-del-cri').click(function() {
        var $content   = $('#tbl-cri-body');
        var $highlight = $content.find('tr.hle-grid-highlight');
        var $id        = $highlight.attr('data-id');
        var $fsuccess  = function() {
            $highlight.remove();
            FixTable($content);
        };
        var $dialog  = $('#dialog-remove');
        $dialog.find('#txt-message').text("Вы хотите удалить данный критерий?");
        $dialog.dialog('option', 'title', 'Подтверждение удаления');
        $dialog.dialog('option', 'url', "/cri/remove");
        $dialog.dialog('option', 'data', {'id': $id});
        $dialog.dialog('option', 'fsuccess', $fsuccess);
        $dialog.dialog('open');
    });

    $('#button-del-cri-group').click(function() {
        var $content = $('#tbl-cri-group-body');
        var $highlight  = $content.find('tr.hle-grid-highlight');
        var $id = $highlight.attr('data-id');
        var $fsuccess  = function() {
            $highlight.remove();
            FixTable($content);
        };
        var $dialog  = $('#dialog-remove');
        $dialog.find('#txt-message').text("Вы хотите удалить данную группу критериев?");
        $dialog.dialog('option', 'title', 'Подтверждение удаления');
        $dialog.dialog('option', 'url', "/crigroup/remove");
        $dialog.dialog('option', 'data', {'id': $id});
        $dialog.dialog('option', 'fsuccess', $fsuccess);
        $dialog.dialog('open');
    });


    $("#dialog-cri").dialog({
        autoOpen: false, minHeight: 60, width: 400, modal: true, resizable: false,
        buttons: {
            'Ok': function() {
                var $name = $("#name-cri").val();
                var $type = $(this).dialog('option', 'type');
                var $url  = $(this).dialog('option', 'url') + '/' + $type;
                var $content = $(this).dialog('option', 'content');
                var $highlight  = $content.find('tr.hle-grid-highlight');
                var $table = $(this).dialog('option', 'table');
                var $footTable = $table.find('tfoot');
                var $id = $(this).dialog('option', 'id');
                var fsuccess = null;
                if ($type == 'create') {
                    fsuccess = function(data){
                        if (data) {
                            var $i = $content.find('tr:last-child td:eq(0) div').text();
                            var $tBody = $content.find('tbody:last');
                            parseInt($i);
                            $i++;
                            AddTrTable($content);
                            $tBody.append('<tr data-id="' + data._id + '">' +
                                '<td class="td-1"><div>' + $i + '</div></td>'+
                                '<td class="td-2"><div>' + data.name + '</div></td></tr>'
                            );
                            $footTable.find('th:eq(0) div').text($i);
                            FixTable($content);
                        }
                    };
                    ajaxData('POST', $url, {'name':$name}, fsuccess);
                }
                if ($type == 'update') {
                    fsuccess = function(data){
                        if (data) {
                            $highlight.find('td:eq(1) div').text(data.name);
                        }
                    };
                    ajaxData('POST', $url, {'id':$id,'name':$name}, fsuccess);
                }
                $(this).dialog('close');
            },
            'Отмена': function() {$( this ).dialog('close');}
        },
        close: function() {$( this ).dialog('close');}
    });

    $('#button-add-role').click(function() {
        var $content = $('#tbl-role-body');
        var $dialog = $('#dialog-role-add');
        $dialog.find('#name-role').val('');
        $dialog.dialog('option', 'title', 'Добавить роль');
        $dialog.dialog('option', 'content', $content);
        $dialog.dialog('open');
    });

    $('#button-edit-role').click(function() {
        var $content    = $('#tbl-role-body');
        var $tBody      = $content.find('tbody:last');
        var $dialog     = $('#dialog-role-edit');
        var $highlight  = $content.find('tr.hle-grid-highlight');
        var $id         = $highlight.attr('data-id');
        var $name       = $highlight.find('td:eq(1) div').text();
        var fsuccess    = null;
        if ($id) {
            fsuccess = function(data){
                $("#edtMark-role").iCheck(data.btnMarks);
                $("#newTask-role").iCheck(data.newTasks);
                $("#edtTask-role").iCheck(data.edtTasks);
                $("#delTask-role").iCheck(data.delTasks);
                $("#perSettings-role").iCheck(data.perSettings);
                $content = $('#tbl-role-office-body');
                $tBody = $content.find('tbody:last');
                $content.find('tr').remove();
                $tBody.html(data.listObj);
                $('#tbl-role-office').find('tfoot th:eq(0) div').text(data.countObj);
                FixTable($content);

                $content = $('#tbl-role-group-body');
                $tBody = $content.find('tbody:last');
                $content.find('tr').remove();
                $tBody.html(data.listGrp);
                $('#tbl-role-group').find('tfoot th:eq(0) div').text(data.countGrp);
                FixTable($content);
            };
            ajaxData('POST', '/role/load', {'id':$id}, fsuccess);
        } else {
            var $msgBox = $('#dialog-message');
            $('#txt-message').text("отсутствует ID записи");
            $msgBox.dialog('open');
        }
        $dialog.find('#name-role').val($name);

        $dialog.dialog('option', 'title', 'Изменить роль');
        $dialog.dialog('option', 'id', $id);
        $dialog.dialog('option', 'content', $content);
        $dialog.dialog('open');
    });

    $('#button-add-user').click(function() {
        var $content = $('#tbl-user-body');
        var $dialog = $('#dialog-user');
        $dialog.find('#name-user').val('');
        $dialog.find('#login-user').val('');
        $dialog.find('#password-user').val('');
        $('#btn-role').button({ label: "Роль не выбрана" });
        $dialog.dialog('option', 'title', 'Добавить нового пользователя');
        $dialog.dialog('option', 'type', 'insert');
        $dialog.dialog('option', 'content', $content);
        $dialog.dialog('open');
    });

    $('#button-edit-user').click(function() {
        var $content    = $('#tbl-user-body');
        var $highlight  = $content.find('tr.hle-grid-highlight');
        var $dialog     = $('#dialog-user');
        var $id         = $highlight.attr('data-id');
        var $idRole     = $highlight.attr('data-id-role');
        var $fullName   = $highlight.find('td:eq(1) div').text();
        var $username   = $highlight.find('td:eq(2) div').text();
        var $rolename   = $highlight.find('td:eq(3) div').text();
        $dialog.find('#name-user').val($fullName);
        $dialog.find('#login-user').val($username);
        $dialog.find('#password-user').val('');
        $('#btn-role').button({ label: $rolename });
        $dialog.dialog('option', 'title', 'Редактирование текущего пользователя');
        $dialog.dialog('option', 'type', 'update');
        $dialog.dialog('option', 'content', $content);
        $dialog.dialog('option', 'id', $id);
        $dialog.dialog('option', 'idRole', $idRole);
        $dialog.dialog('open');
    });

    $('#button-del-user').click(function() {
        var $content = $('#tbl-user-body');
        var $highlight  = $content.find('tr.hle-grid-highlight');
        var $id = $highlight.attr('data-id');
        var $fsuccess  = function() {
            $highlight.remove();
            FixTable($content);
        };
        var $dialog  = $('#dialog-remove');
        $dialog.find('#txt-message').text("Вы хотите удалить данного пользователя?");
        $dialog.dialog('option', 'title', 'Подтверждение удаления');
        $dialog.dialog('option', 'url', "/user/remove");
        $dialog.dialog('option', 'data', {'id': $id});
        $dialog.dialog('option', 'fsuccess', $fsuccess);
        $dialog.dialog('open');
    });

    $('#button-password-user').click(function() {
        var $content    = $('#tbl-user-body');
        var $highlight  = $content.find('tr.hle-grid-highlight');
        var $id         = $highlight.attr('data-id');
        var $dialog     = $('#dialog-password');
        $dialog.find('#password-new-user').val('');
        $dialog.find('#password-retry-user').val('');
        $dialog.dialog('option', 'title', 'Изменение пароля текущего пользователя');
        $dialog.dialog('option', 'id', $id);
        $dialog.dialog('open');
    });

    $('#button-del-role-office').click(function() {
        var $content = $('#tbl-role-body');
        var $highlight  = $content.find('tr.hle-grid-highlight');
        var $id = $highlight.attr('data-id');
        $content = $('#tbl-role-office-body');
        $highlight  = $content.find('tr.hle-grid-highlight');
        var $idObj = $highlight.attr('data-id');
        var $fsuccess  = function() {
            $highlight.remove();
            FixTable($content);
        };
        var $dialog  = $('#dialog-remove');
        $dialog.find('#txt-message').text("Вы хотите убрать данный объект?");
        $dialog.dialog('option', 'title', 'Подтверждение удаления');
        $dialog.dialog('option', 'url', "role/object/remove");
        $dialog.dialog('option', 'data', {'id': $id, 'idObj':$idObj});
        $dialog.dialog('option', 'fsuccess', $fsuccess);
        $dialog.dialog('open');
    });

    $('#button-add-role-office').click(function() {
        var $content     = $('#tbl-role-body');
        var $contentObj  = $('#tbl-role-office-body');
        var $contentFoot = $('#tbl-role-office').find('tfoot th:eq(0) div');
        var $highlight   = $content.find('tr.hle-grid-highlight');
        var $id          = $highlight.attr('data-id');
        $content = $('#tbl-sprav-body');
        var $tBody = $content.find('tbody:last');
        var fsuccess = function(data){
            if (data) {
                $content.find('tr').remove();
                $tBody.html(data.list);
                $('#tbl-sprav').find('tfoot th:eq(0) div').text(data.count);
                var $dialog = $('#dialog-form-tbl');
                $dialog.dialog('option', 'type', 'object');
                $dialog.dialog('option', 'id', $id);
                $dialog.dialog('option', 'url', 'role/object/add');
                $dialog.dialog('option', 'title', 'Объект оценки');
                $dialog.dialog('option', 'content', $content);
                $dialog.dialog('option', 'contentFoot', $contentFoot);
                $dialog.dialog('option', 'contentObj', $contentObj);
                $dialog.dialog('open');
                FixTable($content);
            }
        };
        ajaxData('GET', '/object/list', {}, fsuccess);
    });

    $('#button-del-role-group').click(function() {
        var $content = $('#tbl-role-body');
        var $highlight  = $content.find('tr.hle-grid-highlight');
        var $id = $highlight.attr('data-id');
        $content = $('#tbl-role-group-body');
        $highlight  = $content.find('tr.hle-grid-highlight');
        var $idObj = $highlight.attr('data-id');
        var $fsuccess  = function() {
            $highlight.remove();
            FixTable($content);
        };
        var $dialog  = $('#dialog-remove');
        $dialog.find('#txt-message').text("Вы хотите убрать данную группу?");
        $dialog.dialog('option', 'title', 'Подтверждение удаления');
        $dialog.dialog('option', 'url', "role/group/remove");
        $dialog.dialog('option', 'data', {'id': $id, 'idObj':$idObj});
        $dialog.dialog('option', 'fsuccess', $fsuccess);
        $dialog.dialog('open');
    });

    $('#button-add-role-group').click(function() {
        var $content     = $('#tbl-role-body');
        var $contentGrp  = $('#tbl-role-group-body');
        var $contentFoot = $('#tbl-role-group').find('tfoot th:eq(0) div');
        var $highlight   = $content.find('tr.hle-grid-highlight');
        var $id          = $highlight.attr('data-id');
        $content = $("#tbl-sprav-body"); var $i=0;
        var $tBody = $content.find('tbody:last');
        var fsuccess = function(data){
            if (data) {
                $content.find('tr').remove();
                $tBody.html(data.list);
                $('#tbl-sprav').find('tfoot th:eq(0) div').text($i);
                var $dialog = $('#dialog-form-tbl');
                $dialog.dialog('option', 'type', 'groups');
                $dialog.dialog('option', 'title', 'Группы направлений');
                $dialog.dialog('option', 'type', 'group');
                $dialog.dialog('option', 'id', $id);
                $dialog.dialog('option', 'url', 'role/group/add');
                $dialog.dialog('option', 'content', $content);
                $dialog.dialog('option', 'contentFoot', $contentFoot);
                $dialog.dialog('option', 'contentObj', $contentGrp);
                $dialog.dialog('open');
                FixTable($content);
            }
        };
        ajaxData('GET', '/crigroup/list', {}, fsuccess);
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


    $('#dialog-user').dialog({
        autoOpen: false, width: 400, modal: true, resizable: false,
        buttons: {
            'Ok': function() {
                var $type       = $(this).dialog('option', 'type');
                var $content    = $(this).dialog('option', 'content');
                var $highlight  = $content.find('tr.hle-grid-highlight');
                var $tBody      = $content.find('tbody:last');
                var $fullname   = $(this).find('#name-user').val();
                var $role       = $highlight.attr('data-id-role');
                var $mustPass   = $("#mustPassword").prop('checked');
                var $email      = '';
                var $username   = $(this).find('#login-user').val();
                var $i          = $content.find('tr:last-child td:eq(0) div').text();
                var fsuccess    = null;
                var $dt = {};
                parseInt($i); $i++;
                if ($type == 'insert') {
                    fsuccess = function(data) {
                        AddTrTable($content);
                        $tBody.append('<tr data-id="'+ data._id +'">' +
                            '<td class="td-1"><div>' + $i + '</div></td>'+
                            '<td class="td-2"><div>' + data.fullname + '</div></td>'+
                            '<td class="td-3"><div>' + data.username + '</div></td>'+
                            '<td class="td-4"><div>' + data.role + '</div></td>'+'</tr>'
                        );
                        FixTable($content);
                    };
                    $dt = {'fullname':$fullname,'username':$username,'role':$role,'email':$email};
                    ajaxData('POST','/user/create', $dt, fsuccess);
                }
                if ($type == 'update') {
                    var $id = $(this).dialog('option', 'id');
                    if ($id) {
                        fsuccess = function(data) {
                            $highlight.find('td:eq(1) div').text(data.fullname);
                            $highlight.find('td:eq(2) div').text(data.username);
                            $highlight.find('td:eq(3) div').text(data.role.name);
                        };
                        $dt = {'id':$id,'fullname':$fullname,
                               'username':$username,'email':$email,'role':$role, 'mustPassword':$mustPass};
                        ajaxData('POST','/user/update', $dt, fsuccess);
                    } else {
                        var $msgBox = $('#dialog-message');
                        $('#txt-message').text('У данной записи отсутствует ID');
                        $msgBox.dialog('open');
                    }
                }
                $(this).dialog('close');
            },
            'Отмена': function() {
                $(this).dialog('close');
            }
        },
        close: function() {$(this).dialog('close');}
    });

    $('#dialog-subject').dialog({
        autoOpen: false, height: 400, width: 400, modal: true, resizable: false,
        buttons: {
            'Сохранить': function() {
                var $content = $(this).dialog('option', 'content');
                var $tBody   = $content.find('tbody:last');
                var $idSbj   = $(this).dialog('option', 'idSbj');
                var $idObj   = $(this).dialog('option', 'idObj');
                var $fName   = $(this).find('#fName-subject').val();
                var $sName   = $(this).find('#sName-subject').val();
                var $tName   = $(this).find('#tName-subject').val();
                var $type    = $(this).dialog('option', 'type');

                if ($type == 'create') {
                        var fsuccess = function(data) {
                        AddTrTable($content);
                        $tBody.append('<tr data-id=' + data._id + ' data-id-obj=' + data.idObj + '>' +
                            '<td class="td-1"><div>' + $i + '</div></td>'+
                            '<td class="td-2"><div>' + data.fName + '</div></td>'+'</tr>'
                        );
                        FixTable($content);
                    };
                    ajaxData('POST', '/subject/create', {'idObj':$idObj, 'fName':$fName, 'sName':$sName, 'tName':$tName}, fsuccess);
                    $(this).dialog('close');
                }
            },
            'Отмена': function() {
                $(this).dialog('close');
            }
        },
        close: function() {$(this).dialog('close');}
    });

    $('#dialog-role-add').dialog({
        autoOpen: false, height: 150, width: 400, modal: true, resizable: false,
        buttons: {
            'Сохранить': function() {
                var $content    = $(this).dialog('option', 'content');
                var $tBody      = $content.find('tbody:last');
                var $i          = $content.find('tr:last-child td:eq(0) div').text();
                var $name       = $(this).find('#name-role').val();
                parseInt($i); $i++;

                var fsuccess = function(data) {
                    AddTrTable($content);
                    $tBody.append('<tr data-id="'+ data._id +'">' +
                            '<td class="td-1"><div>' + $i + '</div></td>'+
                            '<td class="td-2"><div>' + data.name + '</div></td>'+'</tr>'
                    );
                    FixTable($content);
                };
                ajaxData('POST','/role/create', {'name':$name}, fsuccess);
                $(this).dialog('close');
            },
            'Отмена': function() {
                $(this).dialog('close');
            }
        },
        close: function() {$(this).dialog('close');}
    });

    $('#dialog-role-edit').dialog({
        autoOpen: false, height: 450, width: 750, modal: true, resizable: false,
        buttons: {
            'Сохранить': function() {
                var $content     = $(this).dialog('option', 'content');
                var $highlight   = $content.find('tr.hle-grid-highlight');
                var $name        = $(this).find('#name-role').val();
                var $btnMarks    = $("#edtMark-role").prop('checked');
                var $newTasks    = $("#newTask-role").prop('checked');
                var $edtTasks    = $("#edtTask-role").prop('checked');
                var $delTasks    = $("#delTask-role").prop('checked');
                var $perSettings = $("#perSettings-role").prop('checked');
                var fsuccess     = null;
                var $dt          = {};
                var $id = $(this).dialog('option', 'id');
                if ($id) {
                    fsuccess = function(data) {
                        $highlight.find('td:eq(1) div').text(data.name);
                    };
                    $dt = {'id':$id, 'btnMarks':$btnMarks,
                           'newTasks':$newTasks, 'edtTasks':$edtTasks,
                           'delTasks':$delTasks, 'name':$name, 'perSettings':$perSettings};
                    ajaxData('POST','/role/update', $dt, fsuccess);
                    $(this).dialog('close');
                } else {
                    var $msgBox = $('#dialog-message');
                    $('#txt-message').text('У данной записи отсутствует ID');
                    $msgBox.dialog('open');
                }
            },
            'Отмена': function() {
                $(this).dialog('close');
            }
        },
        close: function() {$(this).dialog('close');}
    });

    $( "#dialog-form-tbl" ).dialog({
        autoOpen: false, //height: 400, width: 300,
        modal: true, resizable: false,
        dialogClass: 'no-dialog-padding',
        buttons: {
            "Ok": function() {
                var $content      = $(this).dialog('option', 'content');
                var $contentObj   = $(this).dialog('option', 'contentObj');
                var $url          = $(this).dialog('option', 'url');
                var $contentFoot  = $(this).dialog('option', 'contentFoot');
                var $highlight    = $content.find('tr.hle-grid-highlight');
                var $idObj        = $highlight.attr('data-id');
                var $id           = $(this).dialog('option', 'id');
                var fsuccess = function(data){
                    var $tBody = $contentObj.find('tbody:last');
                    $contentObj.find('tr').remove();
                    $tBody.html(data.listObj);
                    $contentFoot.text(data.countObj);
                    FixTable($contentObj);
                };
                ajaxData('POST', $url, {'id':$id,'idObj':$idObj}, fsuccess);
                $( this ).dialog( "close" );
            },
            "Отмена": function() {$( this ).dialog( "close" );}
        },
        close: function() {$( this ).dialog( "close" );}
    });


    $("#btn-role").click(function() {
        var $content = $('#tbl-sprav-role-body');
        var $tBody = $content.find('tbody:last');
        var $btn = $(this);
        var fsuccess = function(data){
            if (data) {
                $content.find('tr').remove();
                $tBody.html(data.list);
                $('#tbl-sprav-role').find('tfoot th:eq(0) div').text(data.count);
                var $dialog = $('#dialog-form-role');
                $dialog.dialog('option', 'title', 'Роли пользователя');
                $dialog.dialog('option', 'content', $content);
                $dialog.dialog('option', 'button', $btn);
                $dialog.dialog('open');
                FixTable($content);
            }
        };
        ajaxData('GET', '/role/list', {}, fsuccess);
    });

    $( "#dialog-form-role" ).dialog({
        autoOpen: false, //height: 400, width: 300,
        modal: true, resizable: false,
        dialogClass: 'no-dialog-padding',
        buttons: {
            "Ok": function() {
                var $content      = $(this).dialog('option', 'content');
                var $button       = $(this).dialog('option', 'button');
                var $highlight    = $content.find('tr.hle-grid-highlight');
                var $id           = $highlight.attr('data-id');
                var $name         = $highlight.find('td:eq(1) div').text();
                $content          = $('#tbl-user-body');
                $highlight        = $content.find('tr.hle-grid-highlight');

                $highlight.attr('data-id-role',$id);
                $highlight.find('td:eq(3) div').text($name);
                $button.button({ label: $name });
                $(this).dialog( "close" );
            },
            "Отмена": function() {$( this ).dialog( "close" );}
        },
        close: function() {$( this ).dialog( "close" );}
    });


    $("input[type=submit], button").button().click(function(event) {
        event.preventDefault();
    });

    $("button").focus(function () {
        $(this).removeClass("ui-state-focus");
    });


});
