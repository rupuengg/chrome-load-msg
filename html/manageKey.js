function getUrlParameter(name) {
	debugger;

  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

var o = {
	channel: [],
	keys: []
};
var a, channel_id, current_tab_host;

// Onload Event Listener
window.onload = function(){
	a = location.search.split("?channel_id=");
	channel_id = a[1];

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		var aa = tabs[0].url.split('/');
		current_tab_host = aa[2];
		console.log('Active tabs', current_tab_host);
		fetch_channel_and_respective_keys();
	});

	// Share Keys
	document.getElementById('button1').addEventListener('click', function(){
		location.href = './share.html?channel_id=' + channel_id;
	});

	// Delete Key Event
	document.getElementById('button2').addEventListener('click', function(){
		var o_key;
		for(var i=0;i<o.keys.length;i++){
			console.log('Match', o.keys[i].key, document.getElementById('keyinput').value);
			if(o.keys[i].key == document.getElementById('keyinput').value && o.keys[i].default){
				o_key = o.keys[i];
				break;
			}
		}
		console.log('Delete', o_key);

		if(o_key){
			// console.log(event.target.selectedIndex, event.target.selectedOptions[0].value);
			if(confirm("The associated messages for this key have been lost. Do you want to delete the associated key for this channel?")){
				// This function is used to change default key for this channel_id with new key
				delete_key_of_this_channel('channel', channel_id, document.getElementById('keyinput').value, function(){
					showMsg('success', 'Key has been destroy');
					fetch_channel_and_respective_keys();
				}());
			}
		}else{
			// This function is used to change default key for this channel_id with new key
			delete_key_of_this_channel('channel', channel_id, document.getElementById('keyinput').value, function(){
				showMsg('success', 'Key has been destroy');
				fetch_channel_and_respective_keys();
			}());
		}
	});
};

// Fetch Channels And Respective Keys
function fetch_channel_and_respective_keys(){
	var k = find_store_key(current_tab_host);
	reterieve(k, function(arr){
		var channel_list = arr[k];

		o.channel = channel_list;

		// Bind Channels
		bind_channel_list(channel_id);

		// Fetch Channel Keys
		reterieve('channel', function(res){
			console.log('generated keys', res);
			if(res['channel']){
				var a = res['channel'].filter(function(value){
					return value.channel_id === channel_id;
				});

				if(a.length > 0){
					o.keys = a;
				}
			}
			console.log('Final Res', o);

			bind_channel_keys();

			// bind_event_with_dropdown(document.getElementById('keyinput'), channel_id);
		});
	});
}

// Bind Channel List To Dropdown
function bind_channel_list(channel_id){
	document.getElementById('sel_channels').innerHTML = '';
	var lst = o.channel.list;
	if(lst){
		var option = document.createElement('option');
		option.setAttribute('value', '');
		option.innerHTML = 'Select channel';
		document.getElementById('sel_channels').appendChild(option);

		for(var i=0;i<lst.length;i++){
			var option = document.createElement('option');
			option.setAttribute('value', lst[i].id);
			if(lst[i].id == channel_id) option.setAttribute('selected', true);
			option.innerHTML = lst[i].title;
			document.getElementById('sel_channels').appendChild(option);
		}
	}
}

// Bind Channel Keys To Dropdown
function bind_channel_keys(){
	document.getElementById('keyinput').innerHTML = '';
	var lst = o.keys;
	if(lst){
		var option = document.createElement('option');
		option.setAttribute('value', '');
		option.innerHTML = 'Select key';
		document.getElementById('keyinput').appendChild(option);

		for(var i=0;i<lst.length;i++){
			var option = document.createElement('option');
			option.setAttribute('value', lst[i].key);
			if(lst[i].default) option.setAttribute('selected', true);
			option.innerHTML = lst[i].alias;
			document.getElementById('keyinput').appendChild(option);
		}
	}
}
