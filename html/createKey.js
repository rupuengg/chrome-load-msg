function getUrlParameter(name) {
	debugger;
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

window.onload = function(){
	document.querySelector('.back').addEventListener('click', function(){
		window.history.back();
	});
};
