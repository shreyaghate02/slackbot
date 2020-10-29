const SlackBot = require('slackbots');
const axios = require('axios');
const dotenv = require('dotenv')
​
dotenv.config()
​
const bot = new SlackBot({
    token: `${process.env.BOT_TOKEN}`,
    name:'jokebot'
});
​
// start handler
​
bot.on('start', () => {
    const params = {
        icon_emoji: ':smiley:'
    };
​
    bot.postMessageToChannel(
        'general',
        'Get Ready To Laugh with @bot',
        params
        // `Hey Team 
        //  My name is Bot!
        //  I will tell you the random jokes. Let’s start how to use bot by typing @bot help
        //  Get Ready To Laugh with @bot!`,
        // params
    );
});
​
// Error handler
bot.on('error', err => console.log(err));
​
// Message Handler
​
bot.on('message', (data) => {
    if(data.type !== 'message'){
        return;
    }
​
    handleMessage(data.text)
    // console.log(data)
})
​
// Response to Data
function handleMessage(message){
    if(message.includes(' chucknorris')){
        chuckJoke();
    }
    else if (message.includes(' yomama')) {
        yoMamaJoke();
      } 
    else if(message.includes(' random')){
        randomJoke();
    }  
    else if (message.includes(' help')) {
        runHelp();
      }
    else if(message.includes('hi')){
        sendGreeting();
    }  
    else if(message.includes('hii')){
        sendGreeting();
    }  
    else if(message.includes('hello')){
        sendGreeting();
    }  
​
}
// function MessageHandler(context, event) {
//     if(event.message == "slack") {
//         var question = {
//                    "type":"survey",
//                    "question":"What ice cream flavour would you like?",
//                    "options":["Vanilla","Chocolate","Strawberry"],
//                }; 
//          context.sendResponse(JSON.stringify(question));     
//        return;   
//     }
//     else if (event.message == "Chocolate") {
//         context.sendResponse("Ooh Chocolate is our favourite flavour!");
//     }
//  }
​
// Greeting:
​
function sendGreeting() {
    var greeting = getGreeting();
    bot.postMessageToChannel('general', greeting);
}
​
function getGreeting() {
    
    var greetings = [
        "hello!",
        "hi there!",
        "cheerio!",
        "how do you do!",
        "¡hola!"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
}
​
// Tell a Chuck Norris Joke
function chuckJoke() {
    axios.get('http://api.icndb.com/jokes/random')
        .then(res => {
            const joke = res.data.value.joke;
  
            const params = {
                icon_emoji: ':laughing:'
            };
  
            bot.postMessageToChannel(
                'general',
                `Chuck Norris: ${joke}`,
                params
            );
        });
  }
​
// Tell a Yo Mama Joke
function yoMamaJoke() {
    axios.get('http://api.yomomma.info').then(res => {
      const joke = res.data.joke;
  
      const params = {
        icon_emoji: ':laughing:'
      };
  
      bot.postMessageToChannel('general', `Yo Mama: ${joke}`, params);
    });
  }  
​
// Tell a Random Joke
function randomJoke(){
    const rand = Math.floor(Math.random() * 2) + 1;
    if(rand == 1){
        chuckJoke();
    }
    else if (rand == 2){
        yoMamaJoke();
    }
}
​
// Show Help Text
function runHelp() {
    const params = {
      icon_emoji: ':question:'
    };
  
    bot.postMessageToChannel(
      'general',
      `Type @bot with either 'chucknorris', 'yomama' or 'random' to get a joke`,
      params
    );
  }