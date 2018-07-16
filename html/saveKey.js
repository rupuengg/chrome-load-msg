function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function loadKeys(selectedValue) {
    chrome.storage.local.get(function (items) {
        var allKeys = Object.keys(items);
        var _dropdownOptions = '';
        allKeys.forEach(key => {
            _dropdownOptions += '<option value="' + key + '"' + (selectedValue == key ? 'selected' : '') + '>' + key + '</option>';
        });
        document.getElementById('dropdown2').innerHTML = _dropdownOptions;
    });
}

function loadKeysAndSetSelecte(){
    var _selected = getUrlParameter('keydropdown');
    loadKeys(_selected);
}

function destoyKey() {
    var _key = document.getElementById("dropdown2").value;
    chrome.storage.local.remove(_key);
    loadKeysAndSetSelecte();
};

document.getElementById("destroy").addEventListener("click", function () {
    destoyKey();
});

document.getElementById("back1").addEventListener("click", function () {
    window.history.back();
});
document.getElementById("share").addEventListener("click", function () {
    window.location.href = 'form5.html';
});

document.addEventListener('DOMContentLoaded', function () {
    loadKeysAndSetSelecte();
}, false);

document.addEventListener('DOMContentLoaded', function () {
    console.log('document is ready. I can sleep now');
});

/* function loaddropdown() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            myFunction(this);
        }
    };

    xhttp.open("GET", "keyfile.xml", true);
    xhttp.send();
};
 */
/* function myFunction(xml) {
    var x, i, xmlDoc, table = "";
    xmlDoc = xml.responseXML;
    x = xmlDoc.getElementsByTagName("channel");
    for (i = 0; i < x.length; i++) {
        y = x[i].getElementsByTagName("key");
        for (j = 0; j < y.length; j++) {
            table += "<option>" + y[j].childNodes[0].nodeValue + "</option>";
        }
    }
    document.getElementById("dropdown2").innerHTML = table;
}; */

/* loaddropdown(); */
