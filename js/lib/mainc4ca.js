/**
 * @author Ichnosnet6
 */

var main = (function () {
    var that = {};
    var response = {};
    var instances = {};
    var registered_callbacks = {}
    var eventBus = {};

    function datePickerRangeOptions() {
        return {
            dateFormat: $.i18n._('dd/mm/yy'),
            presetRanges: [],
            presets: {
                specificDate: $.i18n._('Cerca per una data specifica'),
                // allDatesBefore: $.i18n._('Cerca tutti i messaggi precedenti una data'),
                // allDatesAfter: $.i18n._('Cerca tutti i messaggi successivi una data'),
                dateRange: $.i18n._('Cerca in un intervallo di date')
            },
            rangeStartTitle: $.i18n._('Da:'),
            rangeEndTitle: $.i18n._('A:'),
            doneButtonText: $.i18n._('Conferma'),
            earliestDate: Date.parse('-10years'), //earliest date allowed
            latestDate: Date.parse('1days') //latest date allowed
        };

    }
    function datePickerRangeOptionsReports() {
        return {
            dateFormat: $.i18n._('dd/mm/yy'),
            presetRanges: [],
            presets: {
                specificDate: $.i18n._('lbl_reports_calendar_cerca_per_data'),
                allDatesBefore: $.i18n._('lbl_reports_calendar_cerca_per_data_precendente'),
                allDatesAfter: $.i18n._('lbl_reports_calendar_cerca_per_data_successiva'),
                thisMonth: $.i18n._('lbl_reports_calendar_cerca_questo_mese'),
                lastMonth: $.i18n._('lbl_reports_calendar_cerca_mese_precedente'),
                last3Months: $.i18n._('lbl_reports_calendar_cerca_3_mesi_precedenti'),
                last6Months: $.i18n._('lbl_reports_calendar_cerca_6_mesi_precedenti'),
                last12Months: $.i18n._('lbl_reports_calendar_cerca_12_mesi_precedenti'),
                thisYear: $.i18n._('lbl_reports_calendar_cerca_anno_in_corso'),
                thisPrevYear: $.i18n._('lbl_reports_calendar_cerca_anno_precedente')
            },
            rangeStartTitle: $.i18n._('lbl_reports_calendar_cerca_da'),
            rangeEndTitle: $.i18n._('lbl_reports_calendar_cerca_a'),
            doneButtonText: $.i18n._('lbl_reports_calendar_conferma'),
            earliestDate: Date.parse('-10years'), //earliest date allowed
            latestDate: Date.parse('1days') //latest date allowed
        };

    }
    function registerStartupCallback(name, callback, data) {
        if (registered_callbacks.hasOwnProperty(name)) {
            console.error('ERROR: duplicated property name: ' + name);
        } else {
            registered_callbacks[name] = {cb: callback, data: data};
        }
    }

    function executeAllRegisteredStartupCallbacks() {
        for (var name in registered_callbacks) {
            executeStartupCallback(name);
        }
    }

    function executeStartupCallback(name) {
        registered_callbacks[name].cb(registered_callbacks[name].data);
    }

    function init() {
        that.eventBus = new Vue();//event bus
        $(executeAllRegisteredStartupCallbacks);
    }

    var mouseEvent = function (type, sx, sy, cx, cy) {

        var evt;

        var e = {
            bubbles: true, cancelable: (type != "mousemove"), view: window, detail: 0,
            screenX: sx, screenY: sy, clientX: cx, clientY: cy,
            ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
            button: 0, relatedTarget: undefined
        };

        if (typeof (document.createEvent) == "function") {
            evt = document.createEvent("MouseEvents");
            evt.initMouseEvent(type, e.bubbles, e.cancelable, e.view, e.detail,
                e.screenX, e.screenY, e.clientX, e.clientY,
                e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                e.button, document.body.parentNode);
        } else if (document.createEventObject) {
            evt = document.createEventObject();
            for (prop in e) {
                evt[prop] = e[prop];
            }
            evt.button = {0: 1, 1: 4, 2: 2}[evt.button] || evt.button;
        }
        return evt;
    };

    var dispatchEvent = function (el, evt) {

        if (el.dispatchEvent) {

            el.dispatchEvent(evt);

        } else if (el.fireEvent) {

            el.fireEvent('on' + type, evt);

        }

        return evt;

    };

    var toggle = function (event) {
        var targetId = $(this).attr('data-target');
        if (!targetId || !$('#' + targetId).length) {
            return false;
        }

        $('#' + targetId).toggle();
        $(this).toggleClass('on');
        return false;
    };

    var fireNotify = function (titolo, content) {
        $('<div>').html(content).attr('class', 'notify ').dialog({modal: true, title: titolo, width: 600});
    };

    var onModuleClosed = function (moduleName) {
        //console.log('DELETING:'+moduleName)
        delete instances[moduleName];
    };

    var loadAppFromUrl = function (url, data, type, callback, async) {
        var as = true;
        if (!url) {
            return false;
        }

        var cb = onSuccess;
        if (callback) {
            cb = callback;
            if (async) as = false;
        }

//        alert(cb)

        $.ajax(url, {
            type: type || 'post'
            , data: (data || {})
            , success: cb
            , async: as
            , error: error
        });
    };

    var loadModule = function (moduleName, data) {
        var fn = window[moduleName];
        // console.log(fn);
        if (typeof fn === 'function') {
            instances[moduleName] = fn({'module': moduleName, data: data});
        }
    };

    var onSuccess = function (jsonResponse) {

        if (typeof jsonResponse != 'object') {
            alert('Impossibile completare la richiesta, si è verificato un errore interno del server');
            return;
        }
        processResponse(jsonResponse, that);
    };

    var redirect = function (url, delay) {
        if (delay) {
            setTimeout(function () {
                redirect(url);
            }, delay);
        } else {
            window.location.href = url;
        }
    };

    var reload = function () {
        window.location.reload();
    };

    var update = function (filters, parentEvent, url) {
        if (!url) {
            var url = window.location.href;
        }

        $.ajax(url, {
            type: 'post',
            data: {filters: filters},
            error: error,
            success: function (data) {
                var html;
                if (data.html) {
                    html = data.html;
                } else {
                    html = data;
                }
                for (var i in filters) {
                    var $data = $('<div>' + html + '</div>');
                    //var part = $('#' + filters[i], $(data.html));
                    var id = '#' + filters[i];
                    $(id).replaceWith($(id, $data));
                }
                $(document).trigger('pageUpdated', {'parentEvent': parentEvent});
            }
        });
    };

    var update_get = function (filters, parentEvent, url, callback, block) {
        if (!url) {
            var url = window.location.href;
        }

        $.ajax(url, {
            type: 'get',
            data: {filters: filters},
            error: error,
            beforeSend: function () {
                if (block) {
                    for (var i in filters) {
                        var id = '#' + filters[i];
                        $(id).block({message: '<div ><img src="/images/loader.gif"/></div>', ignoreIfBlocked: true});
                    }
                }
            },
            success: function (data) {
                var html;
                if (data.html) {
                    html = data.html;
                } else {
                    html = data;
                }
                for (var i in filters) {
                    var $data = $('<div>' + html + '</div>');
                    //var part = $('#' + filters[i], $(data.html));
                    var id = '#' + filters[i];
                    $(id).replaceWith($(id, $data));
                    if (block)
                        $(id).unblock();
                }
                if (callback) {
                    callback();
                }
                $(document).trigger('pageUpdated', {'parentEvent': parentEvent});
            }
        });
    };

    var update_get_with_block = function (filters, parentEvent, url, callback, idsBlock) {
        if (!url) {
            var url = window.location.href;
        }

        $.ajax(url, {
            type: 'get',
            data: {filters: filters},
            error: error,
            beforeSend: function () {
                if (idsBlock.length) {
                    for (var i in idsBlock) {
                        var id = '#' + idsBlock[i];
                        $(id).block({message: '<div ><img src="/images/loader.gif"/></div>', ignoreIfBlocked: true});
                    }
                }
            },
            success: function (data) {
                var html;
                if (data.html) {
                    html = data.html;
                } else {
                    html = data;
                }
                for (var i in filters) {
                    var $data = $('<div>' + html + '</div>');
                    //var part = $('#' + filters[i], $(data.html));
                    var id = '#' + filters[i];
                    $(id).replaceWith($(id, $data));
                    //console.log(idsBlock.length);
                    if (idsBlock.length) {
                        //console.log('if');
                        for (var i in idsBlock) {
                            var id_blocked = '#' + idsBlock[i];
                            //console.log(id_blocked);
                            $(id_blocked).unblock();
                        }
                    }
                }
                if (callback) {
                    callback();
                }
                $(document).trigger('pageUpdated', {'parentEvent': parentEvent});
            }
        });
    };

    var getInstance = function (name) {
        return instances[name];
    };

    var processResponse = function (jsonResponse, parent) {

        if (jsonResponse.css) {
            for (var cssIndex in jsonResponse.css) {
                cssLoad(jsonResponse.css[cssIndex]);
            }

        }

        if (jsonResponse.jsFiles && jsonResponse.jsFiles.length) {
            scriptFileLoad(jsonResponse.jsFiles, jsonResponse, parent);
        } else {
            launchModule(jsonResponse, parent);
            executeActions(jsonResponse, parent);
            launchEvents(jsonResponse);
        }
    };

    var cssLoad = function (url) {
        var cssLink = $("<link>");

        $("head").append(cssLink);
        cssLink.attr({
            rel: "stylesheet",
            type: "text/css",
            href: url
        });
    };

    var scriptFileLoad = function (jFiles, jsonResponse, parent) {
        if (jFiles.length == 0) {
            onAllScriptFileLoaded(jsonResponse);
        } else {
            var jFile = jFiles.pop();
            $.getScript(jFile, function () {
                scriptFileLoad(jFiles, jsonResponse, parent);
            });
        }

    };

    var onAllScriptFileLoaded = function (jsonResponse, parent) {
        launchModule(jsonResponse, parent);
        executeActions(jsonResponse, parent);
        launchEvents(jsonResponse);
    };

    var launchEvents = function (jsonResponse) {
        if (jsonResponse.events) {
            for (var key in jsonResponse.events) {
                $(document).trigger(jsonResponse.events[key].name, jsonResponse.events[key].data);
                that.eventBus.$emit(jsonResponse.events[key].name,jsonResponse.events[key].data)
            }
        }
    };

    var executeActions = function (response, parent) {
        if (response.actions) {
            for (var i in response.actions) {
                var context = window;
                var functionName = response.actions[i][0];
                var args = response.actions[i][1];
                var namespaces = functionName.split(".");
                var func = namespaces.pop();
                for (var i = 0; i < namespaces.length; i++) {
                    context = context[namespaces[i]];
                }

                if (!args) {
                    args = [];
                }

                context[func].apply(this, args);
            }
        }
    };

    var launchModule = function (jsonResponse, parent) {

        if (jsonResponse.module && !instances.hasOwnProperty(jsonResponse.module)) {
            var fn = window[jsonResponse.module];
            if (typeof fn === 'function') {
                instances[jsonResponse.module] = fn(jsonResponse, parent);
            }
        }
    };

    var error = function (jqXHR, type, description) {
        if (jqXHR.status == '500') {
            alert('Impossibile completare la richiesta, si è verificato un errore interno del server');
        } else if (jqXHR.status == '404') {
            alert('Il server non è in grado di eseguire la richiesta');
        }
        else if (jqXHR.status == '401') {
            alert('Sessione scaduta, eseguire nuovamente il login!');
            window.location.reload();
        }
        else if (jqXHR.status == '403') {
            alert('Non si possiedono i privilegi sufficienti per accedere a quest\'area');
            window.location.reload();
        }
        else {
            alert('Errore, il server riporta: \n' + description + '!');
        }
    };

    var b64Decode = function (data) {

        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
            ac = 0,
            dec = '',
            tmp_arr = [];

        if (!data) {
            return data;
        }

        data += '';

        do { // unpack four hexets into three octets using index points in b64
            h1 = b64.indexOf(data.charAt(i++));
            h2 = b64.indexOf(data.charAt(i++));
            h3 = b64.indexOf(data.charAt(i++));
            h4 = b64.indexOf(data.charAt(i++));

            bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

            o1 = bits >> 16 & 0xff;
            o2 = bits >> 8 & 0xff;
            o3 = bits & 0xff;

            if (h3 == 64) {
                tmp_arr[ac++] = String.fromCharCode(o1);
            } else if (h4 == 64) {
                tmp_arr[ac++] = String.fromCharCode(o1, o2);
            } else {
                tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
            }
        } while (i < data.length);

        dec = tmp_arr.join('');
        dec = decodeURIComponent(escape(dec));
        return dec.replace(/\0+$/, '');
    };

    var b64Encode = function (data) {
        data = unescape(encodeURIComponent(data));
        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
            ac = 0,
            enc = '',
            tmp_arr = [];

        if (!data) {
            return data;
        }

        do { // pack three octets into four hexets
            o1 = data.charCodeAt(i++);
            o2 = data.charCodeAt(i++);
            o3 = data.charCodeAt(i++);

            bits = o1 << 16 | o2 << 8 | o3;

            h1 = bits >> 18 & 0x3f;
            h2 = bits >> 12 & 0x3f;
            h3 = bits >> 6 & 0x3f;
            h4 = bits & 0x3f;

            // use hexets to index into b64, and append result to encoded string
            tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
        } while (i < data.length);

        enc = tmp_arr.join('');

        var r = data.length % 3;

        return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

    };

    var getCookie = function (c_name) {
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start == -1) {
            c_start = c_value.indexOf(c_name + "=");
        }
        if (c_start == -1) {
            c_value = null;
        } else {
            c_start = c_value.indexOf("=", c_start) + 1;
            var c_end = c_value.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = c_value.length;
            }
            c_value = unescape(c_value.substring(c_start, c_end));
        }
        return c_value;
    };

    var isValidPI = function (pi) {
        var i;
        if (pi == '') {
            return {"result": false, "message": 'Partita IVA non inserita'};
        }
        if (pi.length != 11) {
            return {"result": false, "message": 'Devono essere inseriti undici caratteri'};
        }
        validi = "0123456789";
        for (i = 0; i < 11; i++) {
            if (validi.indexOf(pi.charAt(i)) == -1) {
                return {"result": false, "message": 'Inseriti caratteri non validi per la partita IVA'};
            }
        }

        return {"result": true};
    };


    var isValidCF = function (cf) {
        var validi, i, s, set1, set2, setpari, setdisp;
        if (cf == '') {
            return {"result": false, "message": 'Codice fiscale non inserito'};
        }

        cf = cf.toUpperCase();
        if (cf.length != 16) {
            return {"result": false, "message": 'Il codice fiscale deve avere 16 caratteri!'};
        }

        validi = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (i = 0; i < 16; i++) {
            if (validi.indexOf(cf.charAt(i)) == -1) {
                return {"result": false, "message": 'Inseriti caratteri non validi per il codice fiscale!'};
            }
        }
        set1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        set2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ";
        setpari = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        setdisp = "BAKPLCQDREVOSFTGUHMINJWZYX";
        s = 0;
        for (i = 1; i <= 13; i += 2)
            s += setpari.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))));
        for (i = 0; i <= 14; i += 2)
            s += setdisp.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))));
        if (s % 26 != cf.charCodeAt(15) - 'A'.charCodeAt(0)) {
            return {"result": false, "message": 'Codice fiscale non valido!'};
        }

        return {"result": true};
    };

    var union = function union(array1, array2) {
        var result = array1.concat(array2);

        return removeDuplicate(result);
    };

    var removeDuplicate = function removeDuplicate(array) {
        var a = array.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j]) {
                    a.splice(j--, 1);
                }
                ;
            }
        }

        return a;
    };


    var blockElement = function (id, message) {
        $(id).block({message: message})
    };

    var unblockElement = function (id, message) {
        $(id).unblock()
    };

    var sendForm = function (id) {
        $('#' + id).submit()
    };

    /*
     * gestione applet ... sic...
     */


    //that.loadFromUrlSuccess = loadFromUrlSuccess;
    that.isValidPI = isValidPI;
    that.isValidCF = isValidCF;
    that.dispatchEvent = dispatchEvent;
    that.mouseEvent = mouseEvent;
    that.getCookie = getCookie;
    that.b64Encode = b64Encode;
    that.b64Decode = b64Decode;
    that.update = update;
    that.update_get = update_get;
    that.update_get_with_block = update_get_with_block;
    that.processResponse = processResponse;
    that.redirect = redirect;
    that.reload = reload;
    that.loadAppFromUrl = loadAppFromUrl;
    that.getInstance = getInstance;
    that.toggle = toggle;
    that.loadModule = loadModule;
    that.closeModule = onModuleClosed;
    that.fireNotify = fireNotify;

    that.union = union;
    that.removeDuplicate = removeDuplicate;

    that.blockElement = blockElement;
    that.unblockElement = unblockElement;
    that.registerStartupCallback = registerStartupCallback;

    that.sendForm = sendForm;

    that.datePickerRangeOptions = datePickerRangeOptions;
    that.datePickerRangeOptionsReports = datePickerRangeOptionsReports;
    $(document).bind('moduleClosed', function (e, data) {
        onModuleClosed(data.name);
    });
    $(document).bind('fireNotify', function (e, data) {
        fireNotify(data.titolo, data.html);
    });


    init();
    return that;
})();
