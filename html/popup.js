$(document).ready(function () {
	// loadKeys();

	$('#managekey').click(function () {
		$('#formId').attr('action', 'form3.html?keydropdown=' + document.getElementById('dropdown1').value);
		$('#formId').submit();
	});

	// document.getElementById("sharebtn").addEventListener("click", function (e) {
	// 	e.preventDefault();
	// 	window.location.href = 'form5.html';
	// });
	// document.getElementById("sharebtn2").addEventListener("click", function (e) {
	// 	e.preventDefault();
	// 	window.location.href = 'form5.html';
	// });
});

function loadKeys() {
	// console.log('Start');
	chrome.storage.local.get(function (items) {
		// console.log(items);
		var allKeys = Object.keys(items);
		var _dropdownOptions = '';
		allKeys.forEach(key => {
			_dropdownOptions += '<option value="' + key + '">' + key + '</option>';
		});
		document.getElementById('dropdown1').innerHTML = _dropdownOptions;
	});
}

var o = {
	channel: {}
};
var default_key = "";

// Onload Event Listener
window.onload = function(){
	// Clear All
	// clear();

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		var aa = tabs[0].url.split('/');
		var current_tab_host = aa[2];
		console.log('Active tabs', current_tab_host);

		// Fetch All Generated Keys
		var k = find_store_key(current_tab_host);
		reterieve(k, function(arr){
			var channel_list = arr[k];
			if(channel_list){
				console.log('Channel lists', channel_list);
				reterieve('channel', function(res){
					console.log('generated keys', res);

					if(res['channel']){
						for(var i=0;i<channel_list.list.length;i++){
							var a = res['channel'].filter(function(value){
								return value.channel_id === channel_list.list[i]['id'];
							});

							if(a.length > 0){
								o.channel[channel_list.list[i]['id']] = {
									id: channel_list.list[i]['id'],
									title: channel_list.list[i]['title'],
									keys: a
								};
							}
						}
					}
					console.log('Final Res', o.channel);
					bind_channel();
				});
			}else bind_channel();
		});
	});

	// Send Request To Background Js For Channel List
	// var req_params = {type: 'req', list: 'channel', 'origin': ''};
	// console.log('Send Request From Popup To Background', req_params);
	// chrome.runtime.sendMessage(req_params, function(res){
	// 	console.log('Send Request From Popup To Background Response', res);
	// 	if(res){
	// 		o.channel = res;
	// 		// store({channel: res});
	// 		// bind_channel();
	// 	}
	// });
};

// Bind Channel With Html
function bind_channel(){
	document.getElementById('tbl-tbody-content').innerHTML = '';
	console.log('Bind', o.channel);
	var channels = Object.keys(o.channel);
	if(channels.length > 0){
		for(var i=0;i<channels.length;i++){
			var lst = o.channel[channels[i]];
			console.log('Ch', lst);

			var tr = document.createElement('tr');
			document.getElementById('tbl-tbody-content').appendChild(tr);

			// Title
			var td_channel = document.createElement('td');
			td_channel.innerHTML = '<p>'+lst['title']+'</p>';
			tr.appendChild(td_channel);

			// Keys
			var td_channel_key = document.createElement('td');
			tr.appendChild(td_channel_key);
			var td_channel_key_p = document.createElement('p');
			td_channel_key.appendChild(td_channel_key_p);
			var td_channel_key_p_select = document.createElement('select');
			td_channel_key_p_select.setAttribute('name', 'keydropdown');
			td_channel_key_p.appendChild(td_channel_key_p_select);

			if(lst.keys.length > 0){
				var keys = lst.keys;
				var option = document.createElement('option');
				option.setAttribute('value', '');
				option.innerHTML = 'Select channel';
				td_channel_key_p_select.appendChild(option);

				for(var j=0;j<keys.length;j++){
					var option = document.createElement('option');
					option.setAttribute('value', keys[j].key);
					if(keys[j].default){
						default_key = keys[j].key;
						option.setAttribute('selected', true);
					}
					option.innerHTML = keys[j].alias;
					td_channel_key_p_select.appendChild(option);
				}
				bind_event_with_dropdown(td_channel_key_p_select, lst.id);
			}

			// Manage Button
			var td_channel_button = document.createElement('td');
			td_channel_button.innerHTML = '<p><a class="action" href="./manageKey.html?channel_id=' + lst.id + '">Manage</a></p>';
			tr.appendChild(td_channel_button);
		}
	}else{
		var tr = document.createElement('tr');
		document.getElementById('tbl-tbody-content').appendChild(tr);

		// Title
		var td_channel = document.createElement('td');
		td_channel.setAttribute('colspan', 3);
		td_channel.innerHTML = '<p style="font-weight:normal !important;">No key associated to channels</p>';
		tr.appendChild(td_channel);
	}
}

// Bind Change Event With Dropdown
function bind_event_with_dropdown(obj, channel_id){
	obj.addEventListener('change', function(event){
		// console.log(event.target.selectedIndex, event.target.selectedOptions[0].value);
		if(confirm("The associated messages for this key have been lost. Do you want to change the associated key for this channel?")){
			// This function is used to change default key for this channel_id with new key
			change_default_key_for_channel('channel', channel_id, event.target.selectedOptions[0].value)
		}else{
			var options = obj.querySelectorAll('option');
			for(var i=0;i<options.length;i++){
				if(options[i].value == default_key)
					options[i].setAttribute('selected', true);
				else
					options[i].removeAttribute('selected');
			}
		}
	});
}
