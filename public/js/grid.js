jQuery.fn.extend({
    disableSelection : function() {
        this.each(function() {
            this.onselectstart = function() { return false; }; // IE, Chrome, Safari
            this.unselectable = "on"; // IE, Opera
            jQuery(this).css('-moz-user-select', 'none'); // FF
        });
    },
    enableSelection : function() {
        this.each(function() {
            this.onselectstart = function() {};
            this.unselectable = "off";
            jQuery(this).css('-moz-user-select', 'auto');
        });
    }
});

(function($) {
    $.fn.isScroll = function() {
        return this.children().height() > this.height();
    }
})(jQuery);

function AddTrTable(a) {
    $(a).find("tr:last-child td").css({"border-bottom": "1px solid #cccccc"});
}

function HighlightRow(a){
    $(a).find("tr:first-child").siblings().removeClass("hle-grid-highlight");
    $(a).find("tr:first-child").addClass("hle-grid-highlight");
}

function FixTable(a) {
    if ($(a).parents().isScroll()) {
        $(a).find("tr:last-child td").css({"border-bottom": "none"});
    }
    $(a).find("tbody tr:first-child").siblings().removeClass("hle-grid-highlight");
    $(a).find("tbody tr:first-child").addClass("hle-grid-highlight");
}

function QuarterRome(arabic){
    var r = '';
    if (arabic == 1) {r ='I'}
    if (arabic == 2) {r = 'II'}
    if (arabic == 3) {r = 'III'}
    if (arabic == 4) {r = 'IV'}
    return r;
}

function radarChart(data) {
    var canvas = document.getElementById("canvas-radar");
    if (canvas.getContext) {
        var option = {
            scaleShowLabels : false,
            pointLabelFontSize : 11
        };
        new Chart(canvas.getContext("2d")).Radar(data,option);
    } else {
        alert('Ваш браузер не поддерживает CANVAS');
    }
}

function barChart(data) {
    var canvas = document.getElementById("canvas-bar");
    if (canvas.getContext) {
        var option = {
            scaleShowLabels : false,
            pointLabelFontSize : 11
        };
        new Chart(canvas.getContext("2d")).Radar(data,option);
    } else {
        alert('Ваш браузер не поддерживает CANVAS');
    }
}

$(function () {
    $('div.tbl-body').on('click','tr', function() {
            $(this).siblings().removeClass('hle-grid-highlight');
            $(this).addClass('hle-grid-highlight');
    });
    FixTable('#tbl-mark-body');
    FixTable('#tbl-cri-body');

    $(document).ready(function(){
        $('body *').disableSelection();
    });

    $('#grid-tabs').tabs({
        activate: function( event, ui ) {
            if (ui.newTab.index = 0) {
                FixTable('#tbl-mark-body');
            }
            if (ui.newTab.index = 1) {
                FixTable('#tbl-task-body');
            }
        }
    });

    $('#chart-tabs').tabs({
        activate: function( event, ui ) {
            if (ui.newTab.index = 2) {
                FixTable('#tbl-report-body');
            }
            if (ui.newTab.index = 3) {
                FixTable('#tbl-task-prev-body');
            }
        }
    });

    $('#page-wrapper').tabs({
        activate: function( event, ui ) {
            if (ui.newTab.index = 0) {
                FixTable('#tbl-cri-body');
            }
            if (ui.newTab.index = 1) {
                FixTable('#tbl-cri-group-body');
                FixTable('#tbl-cri-group-content-body');
            }
            if (ui.newTab.index = 2) {
                FixTable('#tbl-object-body');
                FixTable('#tbl-subject-body');
            }
            if (ui.newTab.index = 3) {
                FixTable('#tbl-user-body');
            }
            if (ui.newTab.index = 4) {
                FixTable('#tbl-role-body');
                FixTable('#tbl-role-office');
                FixTable('#tbl-role-group');
            }
            if (ui.newTab.index = 5) {
                FixTable('#tbl-period-body');
            }
        }
    });
});
