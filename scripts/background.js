'use strict';

var pass_data = {
  active_tab: ''
};

// Add Rule For Showing Chrome Extensions
chrome.runtime.onInstalled.addListener(function(){
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {urlMatches: 'slack.com'}
          })
        ],
        actions: [
          new chrome.declarativeContent.ShowPageAction()
        ]
      }
    ]);
  });
});

// Message Listener Event In Background Js
// chrome.extension.onMessage.addListener(function(req, sender, sendResponse){
//   // If Request Come From Popup Js
//   console.log("Request Come From Popup : ", req, pass_data);
//   if(req.type == 'req' && req.list == 'channel'){
//     console.log('Send Request To Inject', req);
//     chrome.runtime.sendMessage(req);
//   }
//
//   // If Request Come From Content Script File
//   // if(req.origin.indexOf(".slack.com") > 0 && req.type == 'channel' && req.list.length > 0){
//   //   console.log("Content script received message: ", req, pass_data);
//   //   pass_data = req;
//   //   chrome.runtime.sendMessage(req);
//   // }
// });

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse){
  console.log('Popup Request', req);

  console.log('Fetch Active tabs');
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    var tab = tabs[0];
    console.log('Active tabs', tab);

    console.log('Send Request From background to Content Script', tab.id, req);
    chrome.tabs.sendMessage(tab.id, req, function(res){
      pass_data = res;
      console.log('Send Request From background to Content Script Response', pass_data);
      sendResponse(pass_data);
    });
  });
  return true;
});

// chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo){
//   chrome.tabs.get(tabId, function(tab){
//     console.log('Active tab', tab, selectInfo);
//     chrome.tabs.sendMessage(tab.id, {type: 'req', list: 'channel', 'origin': ''}, function(res){
//       console.log('Chrome Tab SendMessage Response', res, pass_data);
//       pass_data[tab.id] = res;
//
//       // chrome.runtime.sendMessage(res, function(r){
//       //   console.log('sdsdsds', r);
//       // });
//     });
//   });
// });

// chrome.pageAction.onClicked.addListener(function(tab){
//   pass_data.active_tab = tab.id;
//   pass_data[tab.id] = [];
//
//   console.log('Page action click', tab);
//   chrome.tabs.sendMessage(tab.id, {tab: tab.id, type: 'req', list: 'channel', 'origin': ''}, function(res){
//     pass_data[tab.id] = res;
//     console.log('Chrome Tab SendMessage Response', pass_data);
//     if(res.type == 'channel' && res.list.length > 0){
//       chrome.pageAction.show(tab.id);
//       chrome.pageAction.setPopup({tabId: tab.id, popup: './popup.html'}, function(){
//         // console.log('Show', pass_data, tab.id);
//       });
//     }
//   });
// });

// chrome.browserAction.onClicked.addListener(function(tab){
//   console.log('Send ' + tab.id);
//   // chrome.tabs.sendMessage(tab.id, {req});
//   // chrome.tabs.exe
// });

// chrome.runtime.onMessage.addListener(function(req, sender, sendResponse){
//   alert('Hello1 ' + req.action);
//   // chrome.runtime.sendMessage(req);
//
// });
//
// chrome.pageAction.onClicked.addListener(function(tab){
//   console.log('Send ' + tab.id);
//   chrome.tabs.sendMessage(tab.id, {req});
// });

// chrome.runtime.onMessage.addListener(function(req, sender, sendResponse){
//   chrome.tabs.query({active: true, url: "https://*.slack.com/*", currentWindow: true}, function(tabs){
//     var tab = tabs[0];
//     chrome.tabs.sendMessage(tab.id, req, function(res){
//       alert('Hello1' + req.action);
//       console.log('Background Recive', res);
//     });
//   });
//   // chrome.runtime.sendMessage(req);
// });
//
// console.log(chrome.pageAction);
// chrome.pageAction.onClicked.addListener(function(tab){
//   // console.log('Clicked', tab);
//   alert('icon clicked');
//   // chrome.tabs.sendMessage(tab.id, {action: 'channel', tab: tab.id});
// });
//
// chrome.tabs.query({active: true, url: "https://*.slack.com/*", currentWindow: true}, function(tabs){
//   console.log('Background', tabs);
//   // var tab = tabs[0];
//   // chrome.pageAction.show(tab.id, function(){
//   //   console.log('Page action', 'Show')
//   // });
//
//   // chrome.pageAction.setTitle({tabId: tab.id, title: 'Helllooooo'}, function(){
//   //   console.log('Page action', 'set title');
//   // });
//   //
//   // chrome.tabs.sendMessage(tab.id, {action: 'channel'}, function(res){
//   //   console.log('Background Recive', res);
//   // });
// });

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
//   console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
//   if(request.greeting == 'hello') sendResponse({farewell: 'Hello Rup'});
// });

// chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
//     console.log("something happening from the extension");
//     var data = request.data || {};
//     var linksList = document.querySelectorAll('a');
//     [].forEach.call(linksList, function(header) {
//         header.innerHTML = request.data;
//     });
//     sendResponse({data: data, success: true});
// });

//
// chrome.runtime.onStartup.addListener(function(){
//   console.log('Chrome Runtime onStartup Event');
// });
//
// // chrome.pageAction.onClicked.addListener(function(tab){
// //   console.log('Clicked', tab);
// // });
//
// chrome.webNavigation.onCompleted.addListener(function() {
//   alert("This is my favorite website!");
// }, {url: [{urlMatches : 'https://*.slack.com/*'}]});
//
// // chrome.runtime.onInstalled.addListener(function(obj){
// //   console.log('Chrome Runtime onInstalled Event', obj);
// //
// //   chrome.runtime.onInstalledReason.addEventListener(function(){
// //     console.log('Chrome Runtime onInstalledReason Event', obj);
// //   });
// //
// //   chrome.storage.sync.set({color: '#3aa757'}, function(){
// //     console.log('The color is green.');
// //   });
// //
// //   chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
// //     chrome.declarativeContent.onPageChanged.addRules([
// //       {
// //         conditions: [
// //           new chrome.declarativeContent.PageStateMatcher(
// //             {
// //               pageUrl: {hostEquals: 'developer.chrome.com'},
// //             }
// //           )
// //         ],
// //         actions: [
// //           new chrome.declarativeContent.ShowPageAction()
// //         ]
// //       }
// //     ]);
// //   });
// // });
