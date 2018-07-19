// Config
var config = {
  cfgDebug: true,
  channel_list_key: 'channel-list',
  channel_keys_key: 'channel',
  channels: [],
  keys: [],
  emails: []
};

// Console log
function log(msg){
  var args = log.arguments;
  if(config.cfgDebug) console.log(
    (args[0] ? args[0] : ''),
    (args[1] ? args[1] : ''),
    (args[2] ? args[2] : ''),
    (args[3] ? args[3] : ''),
    (args[4] ? args[4] : ''),
    (args[5] ? args[5] : ''),
    (args[6] ? args[6] : ''));
}

// Show Message
function showMsg(type, msg){
  document.querySelector('.alert span').className = type;
  document.querySelector('.alert span').innerHTML = msg;

  hideMsg(document.querySelector('.alert span'))
}

// Hide Message
function hideMsg(obj){
  setTimeout(function(){
    obj.className = '';
  }, 2000);
}
