(function () {
  emailjs.init("user_oKHtfi3E4vc2GuHEJ6Srb");
})();

function sendEmailfromStanEx(toUseremail,fromUseremail,subject,toUsername, fromUsername, channelName){
    // Change to your service ID, or keep using the default service
    var service_id = "default_service";
    var template_id = "send_a_key";
    var templateParams = {
        'User1': toUsername,
        'user2': fromUsername,
        'channel': channelName,
        'touser': toUseremail,
        'fromuser': fromUseremail,
        'subject' : subject
    };


    emailjs.send(service_id, template_id, templateParams)
        .then(function () {
            alert("Sent!");

        }, function (err) {
            alert("Send email failed!\r\n Response:\n " + JSON.stringify(err));

        });
    return false;
}

function sendEmailtoStanEx(toUseremail, fromUseremail, subject, toUsername, fromUsername, channelName, line1, body){
    // Change to your service ID, or keep using the default service
    var service_id = "default_service";
    var template_id = "feedback_form";
    var templateParams = {
        'User1': toUsername,
        'user2': fromUsername,
        'channel': channelName,
        'touser': toUseremail,
        'fromuser': fromUseremail,
        'subject': subject,
        'line1': line1,
        'body': body
    };


    emailjs.send(service_id, template_id, templateParams)
        .then(function () {
            alert("Sent!");

        }, function (err) {
            alert("Send email failed!\r\n Response:\n " + JSON.stringify(err));

        });
    return false;
}
