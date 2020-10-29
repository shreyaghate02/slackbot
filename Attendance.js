var express = require('express')
var request = require('request')
var bodyParser = require('body-parser')
var app = express()
var port = 3000
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const SlackBot = require('slackbots');
const axios = require('axios');
const dotenv = require('dotenv')
dotenv.config()
const bot = new SlackBot({
    token: `${process.env.BOT_TOKEN}`,
    name:'Joke Bot'
});
// start handler
bot.on('start', () => {
    const params = {
        icon_emoji: ':smiley:'
    };
    bot.postMessageToChannel(
        'general',
        `Hey team, if you want to mark your attendance please type /attendance`,
        params
    );
});
// Error handler
bot.on('error', err => console.log(err));
// Message Handler
// checkin code
app.post('/slack/slash-commands/attendance', urlencodedParser, (req, res) =>{
    res.status(200).end() // best practice to respond with empty 200 status code
    var reqBody = req.body
    var responseURL = reqBody.response_url
    if (reqBody.token != 'enter your verification token here'){
          res.status(403).end("Access forbidden")
      }else{
        var message = {
          "text": "Mark Attendance for the day",
          "attachments": [
              {
                  "text": "Do you want to check-in now?",
                  "fallback": "Shame... buttons aren't supported in this land",
                  "callback_id": "button_tutorial",
                  "color": "#3AA3E3",
                  "attachment_type": "default",
                  "actions": [
                      {
                          "name": "yes",
                          "text": "yes",
                          "type": "button",
                          "value": "yes"
                          },
                          {
                              "label": "Email Address",
                              "name": "email",
                              "type": "text",
                              "subtype": "email",
                              "placeholder": "you@example.com"
                          },
                      {
                          "name": "no",
                          "text": "no",
                          "type": "button",
                          "value": "no"
                      }
                  ]
              }
          ]
      }
        sendMessageToSlackResponseURL(responseURL, message)
      }
  })
function sendMessageToSlackResponseURL(responseURL, JSONmessage){
    var postOptions = {
        uri: responseURL,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: JSONmessage
    }
    request(postOptions, (error, response, body) => {
        if (error){
            // handle errors as you see fit
        }
    })
}
app.post('/slack/actions', urlencodedParser, (req, res) =>{
    res.status(200).end() // best practice to respond with 200 status
    var actionJSONPayload = JSON.parse(req.body.payload) // parse URL-encoded payload JSON string
    var message = {
        "text": actionJSONPayload.user.name+" clicked: "+actionJSONPayload.actions[0].name,
        "replace_original": false
    }
    sendMessageToSlackResponseURL(actionJSONPayload.response_url, message)
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })