// This Function Is Used To Store Data on Chrome Storage
function store(data, callback){
  // Request To Store Data
  console.log('Request To Store Data', data);
  chrome.storage.sync.set(data, callback);
}

// This Function Is Used To Reterieve from Chrome Storage
function reterieve(key, callback){
  // Request To Reterieve Data
  // console.log('Request To Reterieve Data', key);
  chrome.storage.sync.get([key], callback);
}

// This Function Is Used To Clear Data
function remove(key){
  // Clear Data
  console.log('Request To Remove Data', key);
  chrome.storage.sync.remove([key], function(){
    console.log('Remove Data', key);
  });
}

// This Function Is Used To Clear Data
function clear(){
  // Clear Data
  console.log('Request To Clear Data');
  chrome.storage.sync.clear(function(){
    console.log('Clear Data');
  });
}

function add_key_data(key, data){
  reterieve(key, function(res){
    var list = res[key];
    console.log('List', list);
    if(list){
      list.push(data);
    }else{
      list = [];
      list.push(data);
    }
    console.log('Saved data', list);
    store({[key]: list}, function(){
      reterieve(key, function(a){
        console.log('saved data', a);
      });
    });
  });
}
