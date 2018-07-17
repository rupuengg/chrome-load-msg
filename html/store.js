// Find Store Key
function find_store_key(str){
  var a = str.split('.');
  return 'channel-list-' + a[0];
}

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

// Store Data
function add_key_data(key, data, callback){
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
      callback();
      reterieve(key, function(a){
        console.log('saved data', a);
      });
    });
  });
}

// This function is used to change default key for this channel_id with new key
function change_default_key_for_channel(key, channel_id, new_key){
  reterieve(key, function(res){
    var list = res[key];
    console.log('List', list);
    if(list){
      list = list.map(function(value){
        if(value.channel_id == channel_id) value.default = value.key == new_key;
        if(value.channel_id == channel_id) value.activate_date = value.key == new_key ? Date.now() : '';
        return value;
      });
    }
    console.log('Saved data', list);
    store({[key]: list}, function(){
      reterieve(key, function(a){
        console.log('saved data', a);
      });
    });
  });
}

// This function is used to change default key for this channel_id with new key
function delete_key_of_this_channel(key, channel_id, old_key, callback){
  reterieve(key, function(res){
    var list = res[key];
    console.log('List', list);
    if(list){
      var pos = list.findIndex(function(value){
        return value.key == old_key;
      });

      list.splice(pos, 1);
    }
    console.log('Saved data', list);
    store({[key]: list}, function(){
      callback();
      // reterieve(key, function(a){
      //   console.log('saved data', a);
      // });
    });
  });
}
