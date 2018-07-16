function getUrlParameter(name) {
	debugger;

  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

var o = {
	channel: []
};

// Onload Event Listener
window.onload = function(){
	// Send Request To Background Js For Channel List
	var req_params = {type: 'req', list: 'channel', 'origin': ''};
	// console.log('Send Request From Popup To Background', req_params);
	chrome.runtime.sendMessage(req_params, function(res){
		// console.log('Send Request From Popup To Background Response', res);
		if(res){
			o.channel = res;

			// Save Channel List
			store({'channel-list': res});

			// Bind Channels
			bind_channel_list();

			// Bind Generated Key
			generateRandomKey();
		}
	});

	// Generate New Key Event
	document.getElementById('button1').addEventListener('click', function(){
		if(validate_form()){
			console.log('Ok');

			var store_data = {
				channel_id: document.getElementById('sel_channels').value,
				key: document.getElementById('keyinput').value,
				alias: document.getElementById('alias').value,
				default: document.getElementById('key_activate').checked,
				shared_with: document.getElementById('shared_with').value
			};

			console.log('Save Channel Key', store_data);
			if(!document.getElementById('key_activate').checked){
				add_key_data('channel', store_data);
			}else{
				var key = 'channel';
				reterieve(key, function(res){
			    var list = res[key];
					if(list){
				    console.log('List', list);
						for(var i=0;i<list.length;i++){
							list[i]['default'] = false;
						}
				    console.log('Saved data', list);
				    store({[key]: list}, function(){
				      add_key_data('channel', store_data);
				    });
					}else{
						add_key_data('channel', store_data);
					}
			  });
			}

		}
	});
};

// Bind Channel List To Dropdown
function bind_channel_list(){
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
			option.innerHTML = lst[i].title;
			document.getElementById('sel_channels').appendChild(option);
		}
	}
}

// Generate And Bind Random Key to Field
function generateRandomKey(){
    var RandomKey = Date.now().toString();
    document.getElementById('keyinput').value = RandomKey;
}

// Validate Form For Generation Key
function validate_form(){
	// Channel
	var channel = document.getElementById('sel_channels');
	hide(channel.parentElement.querySelector('.error'));
	if(channel.value.trim() == ''){
		show(channel.parentElement.querySelector('.error'));
		return false;
	}

	// Alias
	var alias = document.getElementById('alias');
	hide(alias.parentElement.querySelector('.error'));
	if(alias.value.trim() == ''){
		show(alias.parentElement.querySelector('.error'));
		return false;
	}

	return true;
}

// Show
function show(obj){
	obj.style.display = 'block';
}

// Hide
function hide(obj){
	obj.style.display = 'none';
}
