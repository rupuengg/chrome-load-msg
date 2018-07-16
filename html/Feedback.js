window.onload = function(){
  document.getElementById("button1").addEventListener("click", function(){
    event.preventDefault();

    var reasonDDN = document.getElementById('support');
    var reasonOpt = reasonDDN.options[reasonDDN.selectedIndex].value;
    var line1 = "";
    var subject = document.getElementById('subject').value;
    var body = document.getElementById('message').value;
    if(reasonOpt == "Support"){
      line1 = 'Here is a feedback recieved from user for Support department';
      sendEmailtoStanEx('amitjoshi6aj@gmail.com', 'amitjoshi6aj@gmail.com', 'Feedback-Support: ' + subject, 'StanEx Support', 'StanEx Support', 'ABC', line1, body);
    }else{
      line1 = 'Here is a feedback recieved from user for Technical department';
      sendEmailtoStanEx('amitjoshi6aj@gmail.com', 'amitjoshi6aj@gmail.com', 'Feedback-Technical: ' + subject, 'StanEx developers', 'StanEx Support', 'ABC', line1, body);
    }
    //sendEmailfromEmailJS('amitjoshi6aj@gmail.com', 'amitjoshi6aj@gmail.com', 'Key From StanEx for channel ABC', 'Amit Joshi', 'StanEx Support', 'ABC');
  });
}
