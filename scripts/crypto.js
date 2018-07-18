// Encrypt Message
function secureMessage(msg, pass_key){
  return msg + pass_key;
}

// Decrypt Message
function deSecureMessage(encryptMsg, pass_key){
  return encryptMsg.replace(pass_key, '');
}
