const fetch = require("node-fetch-native");

const fileok = 'ok.log';
const fileerror = 'error.log';

 /// log(nota, fileok, '\r\n');

async function SendSmsWavix(ids, body) {
    /*
        {
            "from": "SenderID",
            "to": "1686xxxxxxx",
            "message_body": {
                "text": "Message text.",
                "media": ["https://publicly-available-resource.com/media"]
            }
        }
    
    */
    
    const response = await fetch(`https://api.wavix.com/v2/messages?appid=${ids}`, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();

    /*
    {
        "message_id": "871b4eeb-f798-4105-be23-32df9e991456",
        "message_type": "mms",
        "from": "13137890021",
        "to": "13137890021",
        "mcc": "301",
        "mnc": "204",
        "message_body": {
            "text": "This is an MT message",
            "media": ["https://publicly-available-resource.com"]
        },
        "tag": null,
        "status": "accepted",
        "segments": 1,
        "charge": "0.02",
        "submitted_at": "2022-04-14T13:51:16.096Z",
        "sent_at": null,
        "delivered_at": null,
        "error_message": null
    }
    */

    // { error: true, message: 'Missing or invalid parameter type' }
   
    if (data.error == true) return [false, data.message]  
    return [true, data]
}

module.exports = {
    SendSmsWavix
}