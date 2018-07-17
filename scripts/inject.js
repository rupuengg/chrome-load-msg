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

// chrome.runtime.onMessage.addListener(function(req, sender, sendResponse){
//   pass_data.tab = req.tab;
//   console.log("Background Request", req, 'Send Response', pass_data);
//   sendResponse(pass_data);
//   // chrome.runtime.sendMessage(req);
// });

chrome.extension.onMessage.addListener(function(req, sender, sendResponse){
  pass_data.tab = req.tab;
  console.log("Background Request", req, 'Send Response', pass_data);
  sendResponse(pass_data);
});

// chrome.runtime.sendMessage('Hello world');

// console.log('--------R--', chrome);
// console.log('--------R--', chrome.runtime);
// chrome.runtime.onMessage.addListener(function(req, sender, sendResponse){
//   console.log(req, sender, sendResponse);
//   if(req.action == 'channel'){
//     sendResponse(s.channel_list);
//   }
// });

// console.log(chrome);


// var port = chrome.runtime.connect({name: 'knockknock'});
// port.postMessage({joke: 'KnockKnock'});
// console.log(port);
//
// port.onMessage.addListener(function(msg){
//   console.log(msg);
// });
