'use strict';

chrome.runtime.onStartup.addListener(function(){
  console.log('Chrome Runtime onStartup Event');
});

chrome.runtime.onInstalled.addListener(function(obj){
  console.log('Chrome Runtime onInstalled Event', obj);

  chrome.runtime.onInstalledReason.addEventListener(function(){
    console.log('Chrome Runtime onInstalledReason Event', obj);

  });

  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('The color is green.');
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
