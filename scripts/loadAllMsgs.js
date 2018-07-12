// console.log('-----', 'Start Load Message Script');
var msg_container,
    menu_list = null,
    chk_height,
    msg_container_len=0,
    selector = 'div[role="listitem"]:not(.s-msg__decrypto)',
    sidebar_selector_for_channel = '.client_channels_list_container .c-scrollbar__child a[data-qa-channel-sidebar-channel-type="channel"]',
    sidebar_selector_for_im = '.client_channels_list_container .c-scrollbar__child a[data-qa-channel-sidebar-channel-type="im"]';

// Fetch All Message List Items
function fetch_all_messages_list(){
  // console.log('-----', 'Get Msg Container Div', msg_container);

  setInterval(function(){
    // console.log('Interval', msg_container_len, msg_container.querySelectorAll('div[role="listitem"]').length);
    if(fetchCryptEle('l') > 0 && fetchCryptEle('l') > msg_container_len){
      // console.log('Change');
      process();
      s.fetch_list();
    }
    // var colls = msg_container.querySelectorAll('div[role="listitem"]');
    msg_container_len = fetchCryptEle('l');
  }, 100);
}

// Process
function process(){
  var colls = fetchCryptEle('o');
  if(colls.length > 0){
    // chk_height = parseFloat(msg_container.firstChild.style.height);
    // console.log('-----', 'Fetch Message Items List', colls.length);

    for(var i=0;i<colls.length;i++){
      decrypt_msg(colls[i]);
    }
  }
}

// fetch all crypt element
function fetchCryptEle(type){
  if(type === 'o') return msg_container.querySelectorAll(selector) ? msg_container.querySelectorAll(selector) : null;
  if(type === 'l') return msg_container.querySelectorAll(selector) ? msg_container.querySelectorAll(selector).length : 0;
}

// Scroll
// function scrollEvent(){
//   console.log('scroll');
//   if(msg_container.querySelectorAll('div[role="listitem"]').length > msg_container_len){
//     // var t = setInterval(function(){
//       console.log(msg_container.querySelectorAll('div[role="listitem"]').length, '>', msg_container_len);
//       if(msg_container.querySelectorAll('div[role="listitem"]').length > msg_container_len){
//         msg_container_len = msg_container.querySelectorAll('div[role="listitem"]').length;
//         // clearInterval(t);
//         fetch_all_messages_list();
//       }
//     // }, 10);
//   }
// }

// Decrypt Message
function decrypt_msg(item){
  var content = item.querySelectorAll('.c-message__content .c-message__body:not(.c-message__body--automated)');
  // console.log('-----', 'Message List Item Content', item, item.getAttribute('conv'), content.length);
  if(content.length > 0){
    var content = content[0];

    // content.innerHTML = secureMessage(content.innerHTML);
    content.innerHTML = deSecureMessage(content.innerHTML);

    // item.setAttribute('conv', '1');
    item.className += ' s-msg__decrypto';
  }
}

// Bind Click Event to Each Menu Items
function bind_event_to_each_menu_item(){
  // console.log('-----', 'Get Menu Items', menu_list);

  for(var i=0;i<menu_list.length;i++){
    var a = menu_list[i].querySelector('a');
    if(a){
      // console.log('-----', 'Bind Click Event to each Menu Item', menu_list[i], a)
      a.addEventListener('click', function(){
        // var interval2 = setInterval(function(){
          // if(chk_height != parseFloat(msg_container.firstChild.style.height) && parseFloat(msg_container.firstChild.style.height) != 0 && chk_height != 0){
            // console.log('-----', 'Click on Menu Items');
            // clearInterval(interval2);
            // console.log('Done', chk_height, parseFloat(msg_container.firstChild.style.height));
            fetch_all_messages_list();
          // }
          // chk_height = parseFloat(msg_container.firstChild.style.height);
          // console.log('sd', chk_height, parseFloat(msg_container.firstChild.style.height));
        // }, 10);
      });
    }
  }
}

// Setinterval for Message Item List
var interval = setInterval(function(){
  if(msg_container != null){
    clearInterval(interval);
    fetch_all_messages_list();

    // var dv = msg_container.firstChild;
    // if(window.addEventListener){
    //   dv.addEventListener('DOMSubtreeModified', scrollEvent, false);
    // }else{
    //   if(window.attachEvent){
    //     dv.attachEvent('DOMSubtreeModified', scrollEvent);
    //   }
    // }
  }
  msg_container = document.querySelector('#messages_container .c-scrollbar__child');
}, 50);

// Setinterval for Menu Item
var interval1 = setInterval(function(){
  if(menu_list != null){
    clearInterval(interval1);
    bind_event_to_each_menu_item();
  }
  menu_list = document.querySelectorAll('.client_channels_list_container div[role="listitem"]');
}, 50);

var s = {
  all_list: [],
  channel_list: [],
  user_list: [],
  // Fetch All List
  fetch_list: function(){
    s.all_list = [];

    // Fetch Channel List
    s.fetch_channel_list(sidebar_selector_for_channel, 'c');

    // Fetch User List
    s.fetch_channel_list(sidebar_selector_for_im, 'u');
  },
  // Fetch All channel list
  fetch_channel_list: function(selector, type){
    // console.log('Start');
    var list = document.querySelectorAll(selector);
    // console.log(list.length, list);

    if(type == 'c') s.channel_list = [];
    if(type == 'u') s.user_list = [];
    for(var i=0;i<list.length;i++){
      var item = list[i];

      var a = {
        id: item.attributes['data-qa-channel-sidebar-channel-id'].nodeValue,
        title: item.querySelector('span').innerText,
        selected: item.className.indexOf("p-channel_sidebar__channel--selected") >= 0 ? true : false
      };

      s.all_list.push(a);
      if(type == 'c') s.channel_list.push(a);
      if(type == 'u') s.user_list.push(a);
    }
    // console.log(s);
  }
}
