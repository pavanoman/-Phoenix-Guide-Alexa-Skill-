var Alexa = require('alexa-sdk');
var http = require('http');

var states = {
    SEARCHMODE: '_SEARCHMODE',
    TOPFIVE: '_TOPFIVE',
};

var location = "Phoenix";

var numberOfResults = 3;

var APIKey = "468c696e42e641afbf5cd1a413c0ad08";

var welcomeMessage = " Phoenix Guide. You can ask me for more information about phoenix ,an attraction, Top things to do ,or  say help. What will it be?";

var welcomeRepromt = "You can ask me more about phoenix , or  say help. What will it be?";

var locationOverview = "Phoenix is the capital and most populous city of the U.S. state of Arizona with population of 1615017 people as of 2016. What else would you like to know?";

var HelpMessage = "Here are some things you  can say: Give me an attraction. Tell me about " + location + ". Tell me the top five things to do or you can say stop to end the session. What would you like to do?";

var moreInformation = "See your  Alexa app for  more  information. You can say stop to end the session or say help for guidelines "

var tryAgainMessage = "please try again.You can say stop to end the session or say help for guidelines"

var noAttractionErrorMessage = "There was an error finding this attraction, " + tryAgainMessage;

var topFiveMoreInfo = "See your  Alexa app for  more  information.You can say stop to end the session or say help for guidelines ";

var getMoreInfoRepromtMessage = " ";

var getMoreInfoMessage = "" ;

var goodbyeMessage = "OK, have a nice time in " + location + ", wonderful human !.";

//var newsIntroMessage = "These are the " + numberOfResults + " most recent " + location + " headlines, you can read more on your Alexa app. ";

var hearMoreMessage = "Would you like to hear about another top thing that you can do in " + location +"?";

var newline = "\n";

var output = "";

var alexa;

var attractions = [
    { name: "Desert Botanical Garden", content: "The Desert Botanical Garden is a 140 acres botanical garden located in Papago Park, at 1201 N. Galvin Parkway in Phoenix, central Arizona.", location: "1201 N Galvin Pkwy, Phoenix, AZ 85008", contact: "(480) 941-1225" },
    { name: "Heard Museum", content: "The Heard Museum is a private, not for profit museum located in Phoenix, Arizona, United States, dedicated to the advancement of American Indian art.", location: "2301 N Central Ave, Phoenix, AZ 85004", contact: "(602) 252-8840" },
    { name: "Camelback Mountain", content: "Camelback Mountain is a mountain in Phoenix, Arizona, United States. The English name is derived from its shape, which resembles the hump and head of a kneeling camel", location: "Maricopa County, Arizona, U.S.", contact: "None" },
    { name: "Arizona Science Center", content: "Arizona Science Center is focused on inspiring, educating, and engaging curious minds through science. The Center is located in Heritage and Science Park in the heart of downtown Phoenix.", location: "600 E Washington St, Phoenix, AZ 85004", contact: "(602) 716-2000" },
    { name: "Phoenix Zoo", content: "The Phoenix Zoo opened in 1962 and is the largest privately owned, non-profit zoo in the United States.", location: "455 N Galvin Pkwy, Phoenix, AZ 85008", contact: "(602) 286-3800" }
];

var topFive = [
    { number: "1", caption: " Fireflies The Yayoi Kusama Infinity Room", more: "The official name “You Who Are Getting Obliterated in the Dancing Swarm of Fireflies” says it all", location: "The exhibit is located in the Contemporary Art Wing of the Phoenix Art Museum, just off of North Central Avenue in Downtown Phoenix, AZ.", contact: "(602) 257-1880" },
    { number: "2", caption: "Mystery Castle", more: "A self-built castle made by a mysterious man", location: "800 E Mineral Rd Phoenix, Arizona, 85042 United States", contact: "http://www.mymysterycastle.com/" },
    { number: "3", caption: "Her Secret Is Patience", more: "A striking public art installation named for a Ralph Waldo Emerson quote.", location: "444 N Central Ave Phoenix, Arizona United States", contact: "617 566 0770" },
    { number: "4", caption: "Papago Park", more: "Expansive hiking & picnicking area that includes the Phoenix Zoo & famed Hole-in-the-Rock formation.", location: " 625 N Galvin Pkwy, Phoenix, AZ 85008", contact: "(602) 495-5458" },
    { number: "5", caption: "Castles N' Coasters", more: "Castles N' Coasters is an amusement park and family amusement center located in Phoenix, Arizona. The approximately 10-acre park features four outdoor 18-hole miniature golf courses, several rides, and an indoor video game arcade.", location: "9445 N Metro Pkwy E, Phoenix, AZ 85051", contact: "(602) 997-7575" }
];

var topFiveIntro = "Here are the top five things to  do in " + location + ".";

var newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = states.SEARCHMODE;
        output = welcomeMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
     'getOverview': function () {
        output = locationOverview;
        this.emit(':askWithCard', output, locationOverview);
    },
    'getAttractionIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getAttractionIntent');
    },
    'getTopFiveIntent': function(){
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTopFiveIntent');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
};

var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
    'getOverview': function () {
        output = locationOverview;
        this.emit(':askWithCard', output, locationOverview);
    },
    'getAttractionIntent': function () {
        var cardTitle = location;
        var cardContent = "";

        var attraction = attractions[Math.floor(Math.random() * attractions.length)];
        if (attraction) {
            output = attraction.name + " " + attraction.content + newline + moreInformation;
            cardTitle = attraction.name;
            cardContent = attraction.content + newline + attraction.contact;

            this.emit(':askWithCard', output, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage, tryAgainMessage);
        }
    },
    'getTopFiveIntent': function () {
        output = topFiveIntro;
        var cardTitle = "Top Five Things To See in " + location;

        for (var counter = topFive.length - 1; counter >= 0; counter--) {
            output += " Number " + topFive[counter].number + ": " + topFive[counter].caption + newline;
        }
        output += topFiveMoreInfo;
        this.handler.state = states.TOPFIVE;
        this.emit(':askWithCard', output, topFiveMoreInfo, cardTitle, output);
    },
    'AMAZON.YesIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.NoIntent': function () {
        output = HelpMessage;
        this.emit(':ask', HelpMessage, HelpMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    // 'getNewsIntent': function () {
    //     httpGet(location, function (response) {

    //         // Parse the response into a JSON object ready to be formatted.
    //         var responseData = JSON.parse(response);
    //         var cardContent = "Data provided by New York Times\n\n";

    //         // Check if we have correct data, If not create an error speech out to try again.
    //         if (responseData == null) {
    //             output = "There was a problem with getting data please try again";
    //         }
    //         else {
    //             output = newsIntroMessage;

    //             // If we have data.
    //             for (var i = 0; i < responseData.response.docs.length; i++) {

    //                 if (i < numberOfResults) {
    //                     // Get the name and description JSON structure.
    //                     var headline = responseData.response.docs[i].headline.main;
    //                     var index = i + 1;

    //                     output += " Headline " + index + ": " + headline + ";";

    //                     cardContent += " Headline " + index + ".\n";
    //                     cardContent += headline + ".\n\n";
    //                 }
    //             }

    //             output += " See your Alexa app for more information.";
    //         }

    //         var cardTitle = location + " News";

    //         alexa.emit(':tellWithCard', output, cardTitle, cardContent);
    //     });
    // },

    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

var topFiveHandlers = Alexa.CreateStateHandler(states.TOPFIVE, {
    'getAttractionIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getAttractionIntent');
    },
    'getOverview': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getOverview');
    },
    'getTopFiveIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTopFiveIntent');
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },


    // 'getMoreInfoIntent': function () {
    //     var slotValue = 0;
    //     if(this.event.request.intent.slots.attraction ) {
    //         if (this.event.request.intent.slots.attraction.value) {
    //             slotValue = this.event.request.intent.slots.attraction.value;

    //         }
    //     }

    //     if (slotValue > 0 && slotValue <= topFive.length) {

    //         var index = parseInt(slotValue) - 1;
    //         var selectedAttraction = topFive[index];

    //         output = selectedAttraction.caption + ". " + selectedAttraction.more + ". " + hearMoreMessage;
    //         var cardTitle = selectedAttraction.caption;
    //         var cardContent = selectedAttraction.caption + newline + newline + selectedAttraction.more + newline + newline + selectedAttraction.location + newline + newline + selectedAttraction.contact;

    //         this.emit(':askWithCard', output, hearMoreMessage, cardTitle, cardContent);
    //     } else {
    //         this.emit(':ask', noAttractionErrorMessage);
    //     }
    // },
    // 'getMoreInfoIntent': function () {
    //     var slotValue = this.event.request.intent.slots.attraction.value;
    //     var index = parseInt(slotValue) - 1;

    //     var selectedAttraction = attractions[index];
    //     if (selectedAttraction) {

    //         output = selectedAttraction.name + ". " + selectedAttraction.content + ". " + hearMoreMessage;
    //         var cardTitle = selectedAttraction.name;
    //         var cardContent = selectedAttraction.name + newline + newline + selectedAttraction.content + newline + newline + selectedAttraction.location + newline + newline + selectedAttraction.contact;

    //         this.emit(':askWithCard', output, hearMoreMessage, cardTitle, cardContent);
    //     } else {
    //         this.emit(':ask', noAttractionErrorMessage);
    //     }
    // },

    // 'getMoreInfoIntent': function () {
    //     var slotValue = this.event.request.intent.slots.attraction.value;
    //     var index = parseInt(slotValue) - 1;

    //     var selectedAttraction = attractions[index];
    //     if (selectedAttraction) {

    //         output = selectedAttraction.caption + ". " + selectedAttraction.more + ". " + hearMoreMessage;
    //         var cardTitle = selectedAttraction.name;
    //         var cardContent = selectedAttraction.caption + newline + newline + selectedAttraction.more + newline + newline + selectedAttraction.location + newline + newline + selectedAttraction.contact;

    //         this.emit(':askWithCard', output, hearMoreMessage, cardTitle, cardContent);
    //     } else {
    //         this.emit(':ask', noAttractionErrorMessage);
    //     }
    // },

    'AMAZON.YesIntent': function () {
        output = getMoreInfoMessage;
        alexa.emit(':ask', output, getMoreInfoRepromtMessage);
    },
    'AMAZON.NoIntent': function () {
        output = goodbyeMessage;
        alexa.emit(':tell', output);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
    },

    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers, topFiveHandlers);
    alexa.execute();
};

// Create a web request and handle the response.
function httpGet(query, callback) {
  console.log("/n QUERY: "+query);

    var options = {
      
        host: 'api.nytimes.com',
        path: '/svc/search/v2/articlesearch.json?q=' + query + '&sort=newest&api-key=' + APIKey,
        method: 'GET'
    };

    var req = http.request(options, (res) => {

        var body = '';

        res.on('data', (d) => {
            body += d;
        });

        res.on('end', function () {
            callback(body);
        });

    });
    req.end();

    req.on('error', (e) => {
        console.error(e);
    });
}

String.prototype.trunc =
      function (n) {
          return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
      };
