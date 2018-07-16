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

// Onload Event Listener
window.onload = function(){
	// Clear All
	// clear();

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

	// Fetch All Generated Keys
	reterieve('channel-list', function(arr){
		var channel_list = arr['channel-list'];
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
							title: channel_list.list[i]['title'],
							keys: a
						};
					}
				}
			}
			console.log('Final Res', o.channel);
			bind_channel();
		});
	});
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
					if(keys[j].default) option.setAttribute('selected', true);
					option.innerHTML = keys[j].alias;
					td_channel_key_p_select.appendChild(option);
				}
			}

			// Manage Button
			var td_channel_button = document.createElement('td');
			td_channel_button.innerHTML = '<p><button type="button">Manage</button></p>';
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
