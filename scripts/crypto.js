// Encrypt Message
function secureMessage(msg){
  var inputString = msg;
  var outputString = '';
  var asciiArr = new Array();
  var atozArr = new Array();
  var encryptedString = new Array();
  if(inputString.length != 0){
    outputString = "";
    //First Step: Convert all characters in ascii code
    for(i = 0; i < inputString.length; i++){
        asciiArr[i] = inputString[i].charCodeAt(0);
    }
    //Second Step: Fill AtoZ array in capital or small letters
    for(i = 0, code = 65; i < 26; i++, code++){
        atozArr[i] = String.fromCharCode(code);
    }
    //Third Step: Choose random single character index from A to Z
    position = randomIndexFromInterval(0, atozArr.length - 1);
    positionAscii = atozArr[position].charCodeAt(0);
    //Fourth Step: Addition of every inputString element to positionAscii
    for(i = 0; i < inputString.length; i++){
        encryptedString[i] = parseInt(asciiArr[i]) + parseInt(atozArr[position].charCodeAt(0));
    }
    //Fifth Step: Attach key to encrypted string
    encryptedString[asciiArr.length] = positionAscii;
    //Sixth Step: Finally your encryption is ready to send
    for(i = 0; i < encryptedString.length; i++){
      outputString = outputString + String.fromCharCode(encryptedString[i]);
    }
    return outputString;
  }else{
    return "Error: Value can not be empty.";
  }
}

// Decrypt Message
function deSecureMessage(encryptMsg){
  var plainText = '';
  if(encryptMsg != 0){
    var encryptedString = encryptMsg;
    var key = encryptedString[encryptedString.length - 1];
    var decryptedString = new Array();
    for(i = 0; i < encryptedString.length - 1; i++){
        decryptedString[i] = encryptedString[i].charCodeAt(0) - key.charCodeAt(0);
    }
    plainText = "";
    for(i = 0; i < decryptedString.length; i++){
        plainText = plainText + String.fromCharCode(decryptedString[i]);
    }
    return plainText;
  }else{
    return "Error: Value can not be empty.";
  }
}

// Random Index From Interval
function randomIndexFromInterval(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// var m = 'Hello World';
// console.log(m);
// var s = secureMessage(m);
// console.log(s);
// var o = deSecureMessage(m);
// console.log(o);
