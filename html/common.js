function showMsg(type, msg){
  document.querySelector('.alert span').className = type;
  document.querySelector('.alert span').innerHTML = msg;

  hideMsg(document.querySelector('.alert span'))
}

function hideMsg(obj){
  setTimeout(function(){
    obj.className = '';
  }, 2000);
}
