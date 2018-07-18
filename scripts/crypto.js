// Encrypt Message
function secureMessage(msg, pass_key){
  return pass_key + msg;
}

// Decrypt Message
function deSecureMessage(encryptMsg, pass_key){
  return encryptMsg.replace(pass_key, '');
}
