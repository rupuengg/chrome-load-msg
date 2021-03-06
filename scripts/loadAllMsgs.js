// log('-----', 'Start Load Message Script');
var msg_container,
    menu_list = null,
    chk_height,
    msg_container_len=0,
    selector = 'div[role="listitem"]:not(.s-msg__decrypto)',
    sidebar_selector_for_channel = '.client_channels_list_container .c-scrollbar__child a[data-qa-channel-sidebar-channel-type="channel"],.client_channels_list_container .c-scrollbar__child a[data-qa-channel-sidebar-channel-type="private"]',
    sidebar_selector_for_im = '.client_channels_list_container .c-scrollbar__child a[data-qa-channel-sidebar-channel-type="im"]',
    selected_channel_id,
    channel_keys;

// Console log
function log(msg){
  var args = log.arguments;
  if(ivx.cfgDebug) console.log(
    (args[0] ? args[0] : ''),
    (args[1] ? args[1] : ''),
    (args[2] ? args[2] : ''),
    (args[3] ? args[3] : ''),
    (args[4] ? args[4] : ''),
    (args[5] ? args[5] : ''),
    (args[6] ? args[6] : ''));
}

// Fetch All Message List Items
function fetch_all_messages_list(key){
  // log('-----', 'Get Msg Container Div', msg_container);

  setInterval(function(){
    // log('Interval', msg_container_len, msg_container.querySelectorAll('div[role="listitem"]').length);
    if(fetchCryptEle('l') > 0 && fetchCryptEle('l') > msg_container_len){
      log('Change');
      process(key);
    }
    // var colls = msg_container.querySelectorAll('div[role="listitem"]');
    msg_container_len = fetchCryptEle('l');
  }, 10);
}

// Process
function process(key){
  var colls = fetchCryptEle('o');
  // if(colls.length > 0){
    // chk_height = parseFloat(msg_container.firstChild.style.height);
    // log('-----', 'Fetch Message Items List', colls.length);

    for(var i=0;i<colls.length;i++){
      decrypt_msg(colls[i], key);
    }
  // }
}

// fetch all crypt element
function fetchCryptEle(type){
  if(type === 'o') return msg_container.querySelectorAll(selector) ? msg_container.querySelectorAll(selector) : null;
  if(type === 'l') return msg_container.querySelectorAll(selector) ? msg_container.querySelectorAll(selector).length : 0;
}

// Scroll
// function scrollEvent(){
//   log('scroll');
//   if(msg_container.querySelectorAll('div[role="listitem"]').length > msg_container_len){
//     // var t = setInterval(function(){
//       log(msg_container.querySelectorAll('div[role="listitem"]').length, '>', msg_container_len);
//       if(msg_container.querySelectorAll('div[role="listitem"]').length > msg_container_len){
//         msg_container_len = msg_container.querySelectorAll('div[role="listitem"]').length;
//         // clearInterval(t);
//         fetch_all_messages_list();
//       }
//     // }, 10);
//   }
// }

// Decrypt Message
function decrypt_msg(item, key){
  var content = item.querySelectorAll('.c-message__content .c-message__body:not(.c-message__body--automated)');
  if(content.length > 0){
    var content = content[0];

    log('-----', 'Message Decrypt', content.innerHTML, key);
    // content.innerHTML = secureMessage(content.innerHTML);
    if(key) content.innerHTML = deSecureMessage(content.innerHTML, key);
    else content.innerHTML = content.innerHTML;

    // item.setAttribute('conv', '1');
    item.className += ' s-msg__decrypto';
  }
}

var s = {
  // all_list: [],
  channel_list: [],
  user_list: [],
  // Fetch All List
  fetch_list: function(){
    // s.all_list = [];

    // Fetch Channel List
    s.fetch_channel_list(sidebar_selector_for_channel, 'c', 1);

    // Fetch User List
    // s.fetch_channel_list(sidebar_selector_for_im, 'u', 1);
  },
  // Fetch All channel list
  fetch_channel_list: function(selector, type, is_send){
    if(!is_send) var is_send = 0;

    // log('Start');
    var list = document.querySelectorAll(selector);
    // log(list.length, list);

    if(type == 'c') s.channel_list = [];
    // if(type == 'u') s.user_list = [];
    for(var i=0;i<list.length;i++){
      var item = list[i];

      var a = {
        id: item.attributes['data-qa-channel-sidebar-channel-id'].nodeValue,
        title: item.querySelector('span').innerText,
        selected: item.className.indexOf("p-channel_sidebar__channel--selected") >= 0 ? true : false,
        type: type
      };

      if(a.selected) selected_channel_id = item.attributes['data-qa-channel-sidebar-channel-id'].nodeValue

      // s.all_list.push(a);
      if(type == 'c') s.channel_list.push(a);
      // if(type == 'u') s.user_list.push(a);
    }

    if(is_send){
      log('Send Channel List to Content Script');

      // chrome.runtime.sendMessage(s.channel_list);
      if(s.channel_list.length > 0){
        window.postMessage({
          type: 'channel',
          list: s.channel_list,
          host: window.location.host
        }, "*");
      }
    }
    // log(s);
  }
};

// Bind Click Event to Each Menu Items
function bind_event_to_each_menu_item(){
  log('Get Menu Items', menu_list.length);

  for(var i=0;i<menu_list.length;i++){
    var a = menu_list[i];
    if(a){
      var attr = a.getAttribute('data-qa-channel-sidebar-channel-type');
      if(['channel', 'private'].indexOf(attr) >= 0){
        if(a.className.indexOf('p-channel_sidebar__channel--selected') >= 0){
          selected_channel_id = a.getAttribute('data-qa-channel-sidebar-channel-id');
        }

        var channel_id = a.getAttribute('data-qa-channel-sidebar-channel-id');
        a.addEventListener('click', function(event){
          // log(event.target.parentElement);
          selected_channel_id = event.target.parentElement.getAttribute('data-qa-channel-sidebar-channel-id');
          var f = channel_keys.filter(function(v){
  					return v.id == selected_channel_id;
  				});
          log('Click', channel_keys, selected_channel_id, f);
          if(f.length > 0){
            // var interval2 = setInterval(function(){
              // if(chk_height != parseFloat(msg_container.firstChild.style.height) && parseFloat(msg_container.firstChild.style.height) != 0 && chk_height != 0){
                // log('-----', 'Click on Menu Items');
                // clearInterval(interval2);
                // log('Done', chk_height, parseFloat(msg_container.firstChild.style.height));
                fetch_all_messages_list(f[0].key);
              // }
              // chk_height = parseFloat(msg_container.firstChild.style.height);
              // log('sd', chk_height, parseFloat(msg_container.firstChild.style.height));
            // }, 10);
          }
        });
      }
    }
  }
}

// Fetch All Channels
function _fetch_channel(callback){
  log('Fetch Channels');
  var t_channel = setInterval(function(){
    if(menu_list){
      if(menu_list.length > 0){
        clearInterval(t_channel);

        // Bind Click Event On Each Channel
        bind_event_to_each_menu_item();

        callback();
      }
    }
    menu_list = document.querySelectorAll('.client_channels_list_container div[role="listitem"] a.p-channel_sidebar__channel');
  }, 50);
}

// // Window Event Listener
// window.addEventListener('load', function(){
//   // Fetch All Channels
//   _fetch_channel(function(){
//     if(document.getElementById('final_channel_keys')){
//       var str = document.getElementById('final_channel_keys').innerHTML;
//       channel_keys = JSON.parse(str);
//       log('Channel And Key', channel_keys);
//       // Fetch All Message Items
//       var t_message = setInterval(function(){
//         if(msg_container != null){
//           clearInterval(t_message);
//
//           var f = channel_keys.filter(function(v){
//             return v.id == selected_channel_id;
//           });
//           log('Load Message Encrypt', f, selected_channel_id);
//           s.fetch_list();
//           if(f.length > 0){
//             fetch_all_messages_list(f[0].key);
//           }
//
//           // var dv = msg_container.firstChild;
//           // if(window.addEventListener){
//           //   dv.addEventListener('DOMSubtreeModified', scrollEvent, false);
//           // }else{
//           //   if(window.attachEvent){
//           //     dv.attachEvent('DOMSubtreeModified', scrollEvent);
//           //   }
//           // }
//         }
//         msg_container = document.querySelector('#messages_container .c-scrollbar__child');
//       }, 50);
//     }else{
//       var t_message = setInterval(function(){
//         if(msg_container != null){
//           clearInterval(t_message);
//           log('Load Message Encrypt', selected_channel_id);
//           s.fetch_list();
//           fetch_all_messages_list("");
//
//           // var dv = msg_container.firstChild;
//           // if(window.addEventListener){
//           //   dv.addEventListener('DOMSubtreeModified', scrollEvent, false);
//           // }else{
//           //   if(window.attachEvent){
//           //     dv.attachEvent('DOMSubtreeModified', scrollEvent);
//           //   }
//           // }
//         }
//         msg_container = document.querySelector('#messages_container .c-scrollbar__child');
//       }, 50);
//     }
//   });
//
//
//
//   // log(document.querySelector(selector).querySelector('.p-channel_sidebar__channel.p-channel_sidebar__channel--selected'));
//   // selected_channel_id = document.querySelector(selector).querySelector('.p-channel_sidebar__channel.p-channel_sidebar__channel--selected').attributes['data-qa-channel-sidebar-channel-id'].nodeValue
//   // log('Window onload event', selected_channel_id, channel_keys);
// });

// Window Event Listener
window.addEventListener('load', function(){
  // Fetch All Channels
  _fetch_channel(function(){
    var t_message = setInterval(function(){
      if(msg_container != null){
        clearInterval(t_message);

        // Fetch Channels List
        s.fetch_list();

        // Fetch All Message Items
        var pass_key = "";
        if(document.getElementById('final_channel_keys')){
          var str = document.getElementById('final_channel_keys').innerHTML;
          channel_keys = JSON.parse(str);
          log('Channel And Key', channel_keys);
          var f = channel_keys.filter(function(v){
            return v.id == selected_channel_id;
          });
          pass_key = f[0].key;
          log('Load Message Encrypt', f, selected_channel_id);
        }

        // Fetch All Messages And Decrypt
        fetch_all_messages_list(pass_key);
      }
      msg_container = document.querySelector('#messages_container .c-scrollbar__child');
    }, 50);
  });
});
