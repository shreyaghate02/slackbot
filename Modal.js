const express = require('express')
var request = require('request')
const bodyParser = require('body-parser')
const { createEventAdapter } = require('@slack/events-api')
const { createMessageAdapter } = require('@slack/interactive-messages')
const { WebClient } = require('@slack/web-api')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT || 3000
const app = express()
const token = 'enter your bot token'
const webClient = new WebClient(token)
const slackEvents = createEventAdapter('enter your signing secret here')
const slackInteractions = createMessageAdapter('enter your signing secret here')
app.use('/slack/events', slackEvents.expressMiddleware())
app.use('/slack/actions', slackInteractions.expressMiddleware())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
const SlackBot = require('slackbots');
const bot = new SlackBot({
  token: `${process.env.BOT_TOKEN}`,
  name:'JokeBot'
});
bot.on('start', () => {
  const params = {
      icon_emoji: ':smiley:'
  };
  bot.postMessageToChannel(
      'general',
      `Hey team, if you want to request leave please type /requestleave`,
      params
  );
});
slackEvents.on('app_mention', async (event) => {
  try {
    const mentionResponseBlock = { ...messageJsonBlock, ...{channel: event.channel}}
    console.log(mentionResponseBlock)
    const res = await webClient.chat.postMessage(mentionResponseBlock)
    console.log('Message sent: ', res.ts)
  } catch (e) {
    console.log(JSON.stringify(e))
  }
})
app.post('/requestleave', async (req,res) => {
    const data ={
        trigger_id: req.body.trigger_id,
        view: modalJsonBlock
    }
  let result = await webClient.views.open(data);
  return res.send('');
  });
slackInteractions.viewSubmission('cute_animal_modal_submit' , async (payload) => {
  const blockData = payload.view.state
  const leavetypeSelection = blockData.values.request_selection_block.request_selection_element.selected_option.value
  const reasonInput = blockData.values.reason_block.reason_element.value
  const startDateInput = blockData.values.start_date_block.start_date.selected_date
  const endDateInput = blockData.values.end_date_block.end_date.selected_date
  console.log(leavetypeSelection, startDateInput, endDateInput, reasonInput)

  if (reasonInput.length < 2) {
    return {
      "response_action": "errors",
      "errors": {
        "request_name_block": "Reason must have more than one letter."
      }
    }
  }
  return {
    response_action: "clear"
  }
})
// Starts server
app.listen(port, function() {
  console.log('Bot is listening on port ' + port)
})
const modalJsonBlock = {
    "type": "modal",
    "callback_id": "leave_modal", // We need to add this  
    "title": {
      "type": "plain_text",
      "text": "Request Leave",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "Done",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "Cancel",
      "emoji": true
    },
    "blocks": [
    //   {
    //     "type": "section",
    //     "text": {
    //       "type": "mrkdwn",
    //       "text": "Ready to request leave"
    //     }
    //   },
      {
        "type": "input",
        "block_id": "request_selection_block", // put this here to identify the selection block
        "element": {
          "type": "static_select",
          "action_id": "request_selection_element", // put this here to identify the selection element
          "placeholder": {
            "type": "plain_text",
            "text": "Please enter type of request",
            "emoji": true
          },
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "Sick Leave",
                "emoji": true
              },
              "value": "Sick Leave"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Casual Leave",
                "emoji": true
              },
              "value": "Casual Leave"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Paid Leave",
                "emoji": true
              },
              "value": "Paid Leave"
            }
          ]
        },
        "label": {
          "type": "plain_text",
          "text": "Request",
          "emoji": true
        }
      },
    //another way to add a datepicker 
    //   {
    //     "type": "section",
    //     "block_id": "start_date_block",
    //     "text": {
    //       "type": "mrkdwn",
    //       "text": "Start Date"
    //     },
    //     "accessory": {
    //       "type": "datepicker",
    //       "action_id": "start_date",
    //       "initial_date": "2020-11-02",
    //       "placeholder": {
    //         "type": "plain_text",
    //         "text": "Select a date"
    //       }
    //     }
    //   },
    //   {
    //     "type": "section",
    //     "block_id": "end_date_block",
    //     "text": {
    //       "type": "mrkdwn",
    //       "text": "End Date"
    //     },
    //     "accessory": {
    //       "type": "datepicker",
    //       "action_id": "end_date",
    //       "initial_date": "2020-11-02",
    //       "placeholder": {
    //         "type": "plain_text",
    //         "text": "Select a date",
    //       }
    //     }
    //   },
    {
        "type": "input",
        "block_id": "start_date_block",
        "element": {
            "type": "datepicker",
            "initial_date": "2020-11-02",
            "action_id": "start_date",
            "placeholder": {
                "type": "plain_text",
                "text": "Select a date",
                "emoji": true
            },
        },
        "label": {
            "type": "plain_text",
            "text": "Start Date",
            "emoji": true
        }
    },
    {
        "type": "input",
        "block_id": "end_date_block",
        "element": {
            "type": "datepicker",
            "initial_date": "2020-11-02",
            "action_id": "end_date",
            "placeholder": {
                "type": "plain_text",
                "text": "Select a date",
                "emoji": true
            },
        },
        "label": {
            "type": "plain_text",
            "text": "End Date",
            "emoji": true
        }
    },
    //another way to add a datepicker
    // {
    //     "type": "actions",
    //     "block_id": "start_date_block",
    //     "elements": [
    //         {
    //             "type": "datepicker",
    //             "initial_date": "2020-11-02",
    //             "placeholder": {
    //                 "type": "plain_text",
    //                 "text": "Select a date",
    //                 "emoji": true
    //             },
    //             "action_id": "start_date"
    //         },
    //         {
    //             "type": "datepicker",
    //             "initial_date": "2020-11-02",
    //             "placeholder": {
    //                 "type": "plain_text",
    //                 "text": "Select a date",
    //                 "emoji": true
    //             },
    //             "action_id": "end_date"
    //         }
    //     ]
    // },
      {
        "type": "input",
        "block_id": "reason_block", // put this here to identify the input.
        "element": {
          "type": "plain_text_input",
          "action_id": "reason_element", // put this here to identify the selection element
          "placeholder": {
            "type": "plain_text",
            "text": "Please enter reason for leave",
            "emoji": true
          },
        },
        "label": {
          "type": "plain_text",
          "text": "Reason",
          "emoji": true
        }
      }
    ]
  }
 
