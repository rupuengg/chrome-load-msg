$(document).ready(function () {
	loadKeys();

	// Show Create Key Form
	$('#createkey').click(function(){
		$('#dv-main-page').hide();
		$('#dv-create-key').show();
	});

	// Show Create Key Form
	$('a.back').click(function(){
		$('#dv-main-page').show();
		$('#dv-create-key').hide();
	});

	$('#managekey').click(function () {
		$('#formId').attr('action', 'form3.html?keydropdown=' + document.getElementById('dropdown1').value);
		$('#formId').submit();
	});
	document.getElementById("sharebtn").addEventListener("click", function (e) {
		e.preventDefault();
		window.location.href = 'form5.html';
	});
	document.getElementById("sharebtn2").addEventListener("click", function (e) {
		e.preventDefault();
		window.location.href = 'form5.html';
	});
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
	channel: []
};

// Onload Event Listener
window.onload = function(){
	// Message Listener Event In Popup
	// chrome.extension.onMessage.addListener(function(req, sender, sendResponse){
	// 	console.log("Popup received message", req);
	// 	if(req){
	// 		if(req.origin.indexOf(".slack.com") > 0 && req.type == 'channel' && req.list.length > 0){
	// 			o.channel = req;
	// 	    chrome.runtime.sendMessage(req);
	// 			bind_channel();
	// 	  }
	// 	}
	// });
	// chrome.extension.sendMessage({type: 'req', list: 'channel', 'origin': ''});

	// Send Request To Background Js For Channel List
	var req_params = {type: 'req', list: 'channel', 'origin': ''};
	console.log('Send Request From Popup To Background', req_params);
	chrome.runtime.sendMessage(req_params, function(res){
		console.log('Send Request From Popup To Background Response', res);
		if(res){
			o.channel = res;
			bind_channel();
		}
	});

	// console.log('Send Request To Background Js');
	// chrome.runtime.onMessage.addListener(function(req, sender, sendResponse){
	// 	console.log(req);
	//   // console.log('Popup Request', req, pass_data)
	// 	o.channel = req;
	// 	bind_channel();
	//   // sendResponse(pass_data[pass_data.active_tab]);
	//   // chrome.runtime.sendMessage({data:datax},function(response){
	//   // });
	// });
};

// Bind Channel With Html
function bind_channel(){
	document.getElementById('tbl-tbody-content').innerHTML = '';
	var lst = o.channel.list;
	if(lst){
		for(var i=0;i<lst.length;i++){
			var tr = document.createElement('tr');
			document.getElementById('tbl-tbody-content').appendChild(tr);

			var td_channel = document.createElement('td');
			td_channel.innerHTML = '<p>'+lst[i]['title']+'</p>';
			tr.appendChild(td_channel);

			var td_channel_key = document.createElement('td');
			td_channel_key.innerHTML = '<p><select id="dropdown1" name="keydropdown"></select></p>';
			tr.appendChild(td_channel_key);

			var td_channel_button = document.createElement('td');
			td_channel_button.innerHTML = '<p><button type="button">Manage</button></p>';
			tr.appendChild(td_channel_button);
		}
	}
}
