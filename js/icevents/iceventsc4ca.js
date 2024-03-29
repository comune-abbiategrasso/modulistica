var iceventsGui = function(data)
{
    var that = {};
    var modal;
    var uploader;

    var onWindowUpdated = function()
    {
        $('#ic_eventi_from_time_date', modal).datepicker();
        $('#ic_eventi_to_time_date', modal).datepicker();


        $("#ic_eventi_from_time_date").change(fillHiddenFields);
        $("#ic_eventi_from_time_date").datepicker("option", "onSelect", fillHiddenFields);

        $("#ic_eventi_to_time_date").change(fillHiddenFields);
        $("#ic_eventi_to_time_date").datepicker("option", "onSelect", fillHiddenFields);

        CKEDITOR.replace('ic_eventi_body', {
            toolbar: 'AlboPretorio',
            toolbar_AlboPretorio: [
                ['Source'],
                ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord'],
                ['Undo', 'Redo', '-', 'Find', 'Replace', '-', 'SelectAll', 'RemoveFormat'],
                ['Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript'],
                ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
                ['Maximize', 'ShowBlocks'],
                ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote', 'CreateDiv'],
                ['Link', 'Unlink', 'Anchor'],
                ['Image', 'Table', 'HorizontalRule', 'SpecialChar', 'PageBreak'],
                ['Styles', 'Format', 'FontSize'],
                ['TextColor', 'BGColor'],
                ['About']
            ],
            startupFocus: true,
            removePlugins: 'save',
            //'contentsCss': '/css/bozza-contratto.css',
            on: {loaded: function(evt) {
                    evt.editor.resize('100%', '450');
                }}
        }
        );
    };

    var fillHiddenFields = function(a, b) {
        var id = b.id.replace('_date', '');
        var date = $("#" + b.id).datepicker("getDate");
        $("#" + id + "_month").val(date.getMonth() + 1);
        $("#" + id + "_day").val(date.getDate());
        $("#" + id + "_year").val(date.getFullYear());
    }
    var onClose = function()
    {
        modal.remove();
        modal = null;
        $(document).trigger('moduleClosed', {name: data.module});
        if (CKEDITOR.instances['ic_eventi_body']) {
            delete CKEDITOR.instances['ic_eventi_body'];
        }
    };

    var onReady = function()
    {
        onWindowUpdated();
        $(modal).on('submit', 'form', sendForm);
    };


    var sendForm = function(event, data)
    {
        var url = $(this).attr('action');

        var data = $(this).serialize();

        $.ajax(url, {
            type: 'post',
            data: data,
            success: processResponse,
            error: onError
        });

        return false;
    };

    var processResponse = function(response)
    {
        if (response.html)
        {
            modal.html(response.html);
            $('.content-header', modal).remove();
        }
        else
        {
            modal.dialog('close');
        }
        main.processResponse(response, that);
        onWindowUpdated();
    };

    var onError = function(jqXHR, type, description)
    {
        var jsonResponse = $.parseJSON(jqXHR.responseText);

        if (jsonResponse)
        {
            $('.alert.alert-info span', modal).text(jsonResponse.message);
            $('.alert.alert-info', modal).toggleClass('alert-error', true).toggleClass('alert-info', false);
            return;
        }

        if (jqXHR.status == '500')
        {
            alert('Impossibile completare la richiesta, si è verificato un errore interno del server');
        }
        else if (jqXHR.status == '404')
        {
            alert('Il server non è in grado di eseguire la richiesta');
        }
        else if (jqXHR.status == '401' || jqXHR.status == '403')
        {
            alert('Sessione scaduta, eseguire nuovamente il login!');
            window.location.reload();
        }
        else
        {
            alert('Errore, il server riporta: \n' + description + '!');
        }

    };

    var closeModule = function()
    {
        modal.dialog('close');
    };

    var createWindow = function(html)
    {
        modal = $('<div>').attr('id', 'pubbicazione-aggiudicazione');
        modal.html(html);
        var title = $('h2', modal).text();
        $('h2', modal).remove();
        modal.dialog({modal: true, title: title, height: 'auto', width: '700', resizable: false, close: onClose, open: onReady});
    };


    if (data.html != undefined)
    {
        createWindow(data.html);
    }

    that.close = closeModule;
    return that;
};


/*
 * 
 * 
 */

var icevents = function() {

    let bootstrapTheme = false;

    var _config = {
        container: '#calendar'
    };

    var _calendar;

    function init(cfg) {
        $.extend(_config, cfg);

        var container = $(_config.container);

        _calendar = container.fullCalendar({
            events: _config.event_list,
            monthNames: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
            monthNamesShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
            dayNames: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
            dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek'
            },
            buttonText: {
                prev: '&nbsp;&#9668;&nbsp;',
                next: '&nbsp;&#9658;&nbsp;',
                prevYear: '&nbsp;&lt;&lt;&nbsp;',
                nextYear: '&nbsp;&gt;&gt;&nbsp;',
                today: 'Oggi',
                month: 'Mese',
                week: 'Sett.'
            },
            eventClick: eventClick,
            eventDrop: eventDrop,
//            eventResize: ic_events.eventResize
        });



    }

    function setBootstrapTheme(){
        bootstrapTheme = true;
    }

    function eventClick(calEvent, jsEvent, view) {
        console.log({
           calEvent,
           jsEvent,
           view
        });
        if (calEvent.url) {
            if (bootstrapTheme){
                window.location = calEvent.url;
            }else{
                main.loadAppFromUrl(calEvent.url, {}, 'get');
            }
        }
        return false;
    }


    function eventDrop(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
        var _start = new Date(event.start);
        var _end = new Date(event.end);
//        alert(
//                event.title + " was moved " +
//                dayDelta + " days and " +
//                minuteDelta + " minutes."
//                );
//
//        if (allDay) {
//            alert("Event is now all-day");
//        } else {
//            alert("Event has a time-of-day");
//        }

        if (!confirm("Conferma lo spostamento dell'evento?")) {
            revertFunc();
        } else {
            $.ajax(_config.event_move,
                    {
                        type: 'POST',
                        data: {
                            id: event.id,
                            start: _start.getTime() / 1000,
                            end: _end.getTime() / 1000,
                            allDay: allDay
                        },
                        success: function(data) {
                            alert('Si è verificato un errore nella modifica dell\'evento');
                            if (data.status == 'error') {
                                revertFunc();
                            }
                        }
                    }
            );
        }

//        console.log(_start.getTime());
//        console.log(_end);

    }

    return {
        init: init,
        setBootstrapTheme: setBootstrapTheme
    };
}();
