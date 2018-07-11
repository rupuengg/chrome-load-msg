// console.log('-----', 'Start Load Message Script');
var msg_container, menu_list, chk_height;

// Fetch All Message List Items
function fetch_all_messages_list(){
  // console.log('-----', 'Get Msg Container Div', msg_container);

  var colls = msg_container.querySelectorAll('div[role="listitem"]');
  if(colls.length > 0){
    chk_height = parseFloat(msg_container.firstChild.style.height);
    // console.log('-----', 'Fetch Message Items List', colls.length);

    for(var i=0;i<colls.length;i++){
      decrypt_msg(colls[i]);
    }
  }
}

// Decrypt Message
function decrypt_msg(item){
  var content = item.querySelectorAll('.c-message__content .c-message__body:not(.c-message__body--automated)');
  // console.log('-----', 'Message List Item Content', item, item.getAttribute('conv'), content.length);
  if(content.length > 0 && !item.getAttribute('conv')){
    var content = content[0];

    content.innerHTML = secureMessage(content.innerHTML);
    item.setAttribute('conv', '1');
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
        var interval2 = setInterval(function(){
          if(chk_height != parseFloat(msg_container.firstChild.style.height) && parseFloat(msg_container.firstChild.style.height) != 0 && chk_height != 0){
            // console.log('-----', 'Click on Menu Items');
            clearInterval(interval2);
            // console.log('Done', chk_height, parseFloat(msg_container.firstChild.style.height));
            fetch_all_messages_list();
          }
          chk_height = parseFloat(msg_container.firstChild.style.height);
          // console.log('sd', chk_height, parseFloat(msg_container.firstChild.style.height));
        }, 10);
      });
    }
  }
}

// Setinterval for Message Item List
var interval = setInterval(function(){
  if(msg_container != null){
    clearInterval(interval);
    fetch_all_messages_list();
  }
  menu_list = document.querySelectorAll('.client_channels_list_container div[role="listitem"]');
  msg_container = document.querySelector('#messages_container .c-scrollbar__child');
}, 50);

// Setinterval for Menu Item
var interval1 = setInterval(function(){
  if(menu_list.length > 0){
    clearInterval(interval1);
    bind_event_to_each_menu_item();
  }
  menu_list = document.querySelectorAll('.client_channels_list_container div[role="listitem"]');
}, 50);

// Encrypt Message
function secureMessage(msg){
  var encryptedAES = (msg + "a657s65da5sd");
  return encryptedAES;
}

// Decrypt Message
function deSecureMessage(encryptMsg){
  var plaintext = encryptMsg.replace("a657s65da5sd","");
  return plaintext;
}
