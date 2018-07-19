var channel_id, register_listeners;

// Share Pass keys
function share_pass_key_to_emails(){
	if(config.emails.length > 0){
		log('Share Pass keys to emails', config.emails);

		// Do code for sharing emails....
		// ..............................
		// ..............................
		// Do code for sharing emails....
	}
}

// Add Email Address
function add_email_address(){
	var email = document.getElementById('shared_with').value;
	if(email.trim() != ''){
		log('Email', email);

		// Check email already exists
		var index = config.emails.findIndex(function(v){
			return v == email;
		});

		if(index >= 0){
			log('Email exists');
			return;
		}

		// Push Email in List
		config.emails.push(email);

		// Render emails
		render_emails();
	}
}

// Render emails
function render_emails(){
	log('Email List', config.emails);
	document.getElementById('user-eml-list').innerHTML = '';
	if(config.emails.length > 0){
		for(var i=0;i<config.emails.length;i++){
			var li = document.createElement('li');
			document.getElementById('user-eml-list').appendChild(li);

			var spanTxt = document.createElement('span');
			spanTxt.innerHTML = config.emails[i];
			li.appendChild(spanTxt);

			var spanClose = document.createElement('span');
			spanClose.setAttribute('class', 'close')
			spanClose.setAttribute('index', i)
			spanClose.innerHTML = 'X';

			// Close Event
			spanClose.addEventListener('click', function(e){
				log('Close event', e.target.getAttribute('index'));

				config.emails.splice(e.target.getAttribute('index'), 1);

				render_emails();
			});

			li.appendChild(spanClose);
		}
	}else{
		var li = document.createElement('li');
		document.getElementById('user-eml-list').appendChild(li);
		li.innerHTML = "No email found.";
	}
}

// Bind Channel Keys To Dropdown
function bind_channel_keys(){
	log('Bind Channel Keys');
	document.getElementById('keyinput').innerHTML = '';

	var option = document.createElement('option');
	option.setAttribute('value', '');
	option.innerHTML = 'Select key';
	document.getElementById('keyinput').appendChild(option);

	var lst = config.keys;
	if(lst){
		for(var i=0;i<lst.length;i++){
			var option = document.createElement('option');
			option.setAttribute('value', lst[i].key);
			if(lst[i].default) option.setAttribute('selected', true);
			option.innerHTML = lst[i].alias;
			document.getElementById('keyinput').appendChild(option);
		}
	}
}

// Fetch Keys Respective Channel
function fetch_keys_respective_channel(channel_id){
	// Fetch Channel Keys
	reterieve(config.channel_keys_key, function(res){
		log('Generated keys', res);
		config.keys = [];
		if(res[config.channel_keys_key]){
			var a = res[config.channel_keys_key].filter(function(value){
				return value.channel_id == channel_id;
			});

			if(a.length > 0){
				config.keys = a;
			}
		}
		log('Final Res', config);

		bind_channel_keys();
	});
}

// Bind Channel List To Dropdown
function bind_channel_list(channel_id){
	document.getElementById('sel_channels').innerHTML = '';
	var lst = config.channels.list;
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

		// Change Channel Event
		document.getElementById('sel_channels').addEventListener('change', function(){
			// Fetch Keys Respective Channel
			fetch_keys_respective_channel(event.target.selectedOptions[0].value);
		});
	}
}

// Fetch Channels And Respective Keys
function fetch_channels(){
	fetch_current_tab_host(function(k){
		log('Active tabs host key', k);

		reterieve(k, function(arr){
			log('Fetch Channel List', arr);
			if(arr[k]){
				var channel_list = arr[k];

				config.channels = channel_list;

				// Bind Channels
				bind_channel_list(channel_id);

				// Fetch Keys Respective Channel
				fetch_keys_respective_channel(channel_id);
			}
		});
	});
}

// Onload Event Listener
window.onload = function(){
	register_listeners = [];

	// Get query string parameters
	var a = location.search.split("?channel_id=");
	channel_id = a[1];

	// Fetch channels
	fetch_channels();

	// Add Email Event Fire
	register_listeners.push({'el': document.getElementById('btnAdd'), 'event': 'click'});
	document.getElementById('btnAdd').addEventListener('click', function(event){
		add_email_address();
	});

	// Cancel Event
	register_listeners.push({'el': document.getElementById('btnCancel'), 'event': 'click'});
	document.getElementById('btnCancel').addEventListener('click', function(event){
		window.history.back();
	});

	// Add email address on enter key

	register_listeners.push({'el': document.getElementById('shared_with'), 'event': 'keypress'});
	document.getElementById('shared_with').addEventListener('keypress', function(event){
		log("Enter key press", event.keyCode);
		if(event.keyCode === 13){
			event.preventDefault();

			add_email_address();
		}
	});

	// Add email address on enter key
	register_listeners.push({'el': document.getElementById('btnSend'), 'event': 'click'});
	document.getElementById('btnSend').addEventListener('click', function(event){
		share_pass_key_to_emails()
	});
};

// Remove Event Listener
window.unload = function(){
	for(var i=0;i<register_listeners.length;i++){
		register_listeners['el'].removeEventListener(register_listeners['event']);
	}
};
