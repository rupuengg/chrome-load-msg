// Is Used To Add script on DOM
function addScript(src){
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', src);
  document.documentElement.appendChild(script);
}

// Add Script for load all messages
addScript(chrome.extension.getURL('scripts/map.js'));
addScript(chrome.extension.getURL('scripts/mimic.js'));
addScript(chrome.extension.getURL('scripts/loadAllMsgs.js'));
addScript(chrome.extension.getURL('scripts/crypto.js'));

var pass_data = '';

// Message Event Listener To Fetch Message From DOM
window.addEventListener("message", function(event){
  // We only accept messages from ourselves
  if(event.source != window) return;

  // Return If No Message Get
  if(event.origin.indexOf(".slack.com") > 0 && event.data == "") return;

  console.log('Load All Msg Recieve Msg', event);

  // Recieve Message From DOM Page
  if(event.data.type == 'channel' && event.data.list.length > 0){
    pass_data = event.data;
    pass_data.origin = event.origin;
    // console.log("Content script received message: ", pass_data);
    // chrome.runtime.sendMessage(pass_data);
  }
});

var aaa = window.location.host.split('.');
var k = 'channel-list-' + aaa[0];
var final_channel_keys = [];

// Fetch Channel And Respective Active Key
function update_on_dom(){
  chrome.storage.sync.get(k, function(arr){
    var channel_list = arr[k].list;
    console.log('Fetch Channels', channel_list);
    chrome.storage.sync.get('channel', function(res){
      var keys = res['channel'];
      console.log('Keys', keys);

      final_channel_keys = [];
      for(var i=0;i<channel_list.length;i++){
        for(var j=0;j<keys.length;j++){
          if(channel_list[i].id == keys[j].channel_id && keys[j].default){
            final_channel_keys.push(Object.assign(channel_list[i], keys[j]));
          }
        }
      }
      final_channel_keys = JSON.stringify(final_channel_keys);
      console.log('Final', final_channel_keys);

      bind_channel_and_key(final_channel_keys);
    });
  });
}

// Extension Message Event Listener
chrome.extension.onMessage.addListener(function(req, sender, sendResponse){
  if(req.type == 'req' && req.list == 'channel'){
    pass_data.tab = req.tab;
    console.log("Background Request", req, 'Send Response', pass_data);
    sendResponse(pass_data);
  }else if(req.type == 'req' && req.list == 'update'){
    update_on_dom();
    sendResponse({msg: 'Save'});
  }
});

// Bind Channel and Key to DOM
function bind_channel_and_key(str){
  if(document.getElementById('final_channel_keys')){
    document.getElementById('final_channel_keys').innerHTML = str;
  }else{
    var d = document.createElement('span')
    d.setAttribute('id', 'final_channel_keys');
    d.setAttribute('style', 'display:none;');
    d.innerHTML = str;
    document.body.appendChild(d);
  }
}

// Window Load Event Listener
window.addEventListener('load', function(){
  update_on_dom();
});
