// Encrypt Message
function secureMessage(msg){
  var encryptedAES = (msg + "a657s65da5sd");
  return encryptedAES;
}

// Decrypt Message
function deSecureMessage(encryptMsg){
  var plaintext = encryptMsg.replace("a657s65da5sd","");
  return plaintext;
}
