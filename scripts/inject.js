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
