
var console = window.console;
var ivx = {
    cfgDebug: true,
    cfgParse: true,
    cfgConvert: true,
    snd: [],
    rcv: [],
    fd: [],
    fm: {},
    mapfrom: {},
    mapto: ivxMap
};
ivx.conv = function(msg, map) {
    var beginTS = Date.now();
    if (ivx.cfgConvert) {
        var words = msg.split(' ');
        var twords = [];
        words.forEach(function(w) {
            var l = w.toLowerCase();
            var t = map[l] || w;
            twords.push(t);
        });
        var tmsg = twords.join(' ');
    } else {
        tmsg = msg;
    }
    var dur = Date.now() - beginTS;
    if (ivx.cfgDebug) {
     console.log('Conversion took ' + dur + ' ms for msg: ' + tmsg );
    }
    return tmsg;

};
for (var prop in ivx.mapto) {
    if(ivx.mapto.hasOwnProperty(prop)) {
        var val = ivx.mapto[prop];
        var lc = val.toLowerCase();
        ivx.mapfrom[lc] = prop;
    }
};

WebSocket.prototype._mimicRcv = function(msgEvent, cbFcn) {
    if (ivx.cfgDebug) {
        console.log('_mimicRcv: ');
    }
    var changedData, parsedData;
    if(!msgEvent || !msgEvent.data) {
        console.error('_mimicRcv: bad event!');
        return;
    }
    if (ivx.cfgDebug) { console.log('_mimicRcv: event.data: ', msgEvent.data );
    }
    var outEvent = msgEvent;
    changedData = msgEvent.data;

    if (ivx.cfgParse) {
        if (ivx.cfgDebug) {
        console.log('_mimicRcv: parsing msgEvent.data');
        }
        parsedData = JSON.parse(msgEvent.data);
        if (ivx.cfgDebug) {
            console.log('_mimicRcv: parsedData: ', parsedData);
        }
    } else {
      changedData = ivx.conv(msgEvent.data, ivx.mapfrom);
      if (ivx.cfgDebug) {
         console.log('_mimicRcv: changedData: ', changedData);
      }
    }
    if (parsedData && parsedData.content) {
      parsedData.content = ivx.conv(parsedData.content, ivx.mapfrom);
      changedData = JSON.stringify(parsedData);
    }
    //var msgFlag = 0;
    if (parsedData && parsedData.text) {
        //parsedData.text = deSecureMessage(parsedData.text);
        parsedData.text = (ivx.conv(parsedData.text, ivx.mapfrom));
        changedData = JSON.stringify(parsedData);
        //msgFlag = 1;
    }
    if (parsedData && ivx.cfgDebug) {
       console.log('_mimicRcv: parsedData.content: ', parsedData.content);
       console.log('_mimicRcv: parsedData.text: ', parsedData.text);
    }

    var outEvent = new MessageEvent(msgEvent.type, {
        data: changedData,
        origin: msgEvent.origin,
        source: msgEvent.source,
        ports: msgEvent.ports
    });
    if (ivx.cfgDebug) {
        ivx.rcv.push(outEvent);
    }
    cbFcn.call(this, outEvent);
    //if (msgFlag == 1)
    //{
    //    var msg_container = document.querySelector('#messages_container .c-scrollbar__child');
    //    var colls = msg_container.querySelectorAll('div[role="listitem"]');
    //    var content = colls[colls.length - 1].querySelectorAll('.c-message__content .c-message__body:not(.c-message__body--automated)');
    //    // console.log('-----', 'Message List Item Content', item, item.getAttribute('conv'), content.length);
    //    if (content.length > 0 && !colls[colls.length - 1].getAttribute('conv')) {
    //        colls[colls.length - 1].setAttribute('conv', '1');
    //    }
    //}
};
WebSocket.prototype._mimicSend = function(msg) {
    if (ivx.cfgDebug) {
        console.log('_mimicSend: '  + msg);
    }
    if(!ivx.ws) {
        ivx.ws = this;
    }
    if (!this._saveOriginalOnMessage) {
        this._saveOriginalOnMessage = this.onmessage;
        var thisObj = this;
        this.onmessage = function(event) {
            thisObj._mimicRcv(event, thisObj._saveOriginalOnMessage);
       };
    }
    if (ivx.cfgParse) {
       var pmsg = JSON.parse(msg);
       if (pmsg.type === 'message' && pmsg.text) {
          pmsg.text = ivx.conv(pmsg.text, ivx.mapto);
          msg = JSON.stringify(pmsg);
          if (ivx.cfgDebug) {
             ivx.snd.push(msg);
          }
       }
    } else {
      msg = ivx.conv(msg, ivx.mapto);
      if (ivx.cfgDebug) {
        console.log('_mimicSend: msg: ', msg);
      }
    }
    if(ivx.cfgDebug) {
        ivx.snd.push(msg);
    }
    this._send(msg);
};
WebSocket.prototype._send = WebSocket.prototype.send;
WebSocket.prototype.send = WebSocket.prototype._mimicSend;


WebSocket.prototype._addEventListener = WebSocket.prototype.addEventListener;
WebSocket.prototype.addEventListener = function( ) {
    if (ivx.cfgDebug) {
       console.log('WebSocket.addEventListener: ' + arguments[0]);
    }
    // NOTE: arguments[]
    //   0 ~ event name ('message')
    //   1 - callback function
    //   2 - [options]
    if (arguments[0] !== 'message') {
        return this._addEventListener.apply(this, arguments);
    } else {

        var thisObj = this;
        let cbFcn = arguments[1];
        return  this._addEventListener('message', function(event) {
            thisObj._mimicRcv(event, cbFcn);
        }, arguments[2]);
    }
};

if (ivx.cfgDebug) {
XMLHttpRequest.prototype._send = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function (body) {
    console.log('XMLHttpRequest.send: ', body);
    ivx.fd.push(body);
    return this._send(body);
};
}
FormData.prototype._append = FormData.prototype.append;
FormData.prototype.append = function (k, v) {
    if (ivx.cfgDebug) {
       console.log('FormData.append: k: ', k, ' v: ', v);
    }
    if ((k === 'type' || k === 'text') && v === 'message') {
        ivx.fm.message =  true;
    }
    if(k === 'text' && v != ''){
        ivx.fm.message =  true;
    }
    if (ivx.fm.message && k === 'text') {
        ivx.fm.message =  false;
        var text = ivx.conv(v, ivx.mapto);

        var f = channel_keys.filter(function(v){
          return v.id == selected_channel_id;
        });

        var msg;
        if(f.length > 0) msg = secureMessage(text, f[0].key);
        else msg = text;

        if(ivx.cfgDebug){
          console.log('-------------Message Send', channel_keys, selected_channel_id, text, f[0].key, msg);
        }

        return this._append(k, msg);
    }
    return this._append(k, v);
};
if(!window.document.domain.match(/slack.com$/)) {
    ivx.cfgParse = false;
}
