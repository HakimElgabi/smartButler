console.log("js loaded");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

var artyom;
var roomInit = function() {
  console.log(`This is room ${roomId}`);

  var speechRecogniser = new webkitSpeechRecognition();
  //continues after
  speechRecogniser.continuous = true;
  speechRecogniser.interimResults = true;
  //english /indian
  speechRecogniser.lang = "en-IN";

  $("[data-listen-button]").click(async (e) => {
    //start listening
    speechRecogniser.start();
    console.log("clicked");

    var finalTranscripts = "";
    speechRecogniser.onresult = function(event) {
      var interimTranscripts = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        var transcript = event.results[i][0].transcript;
        transcript.replace("\n", "<br>");
        if (event.results[i].isFinal) {
          finalTranscripts += transcript;
        } else {
          interimTranscripts += transcript;
        }
        console.log(
          finalTranscripts +
            "<span style='color:#999'>" +
            interimTranscripts +
            "</span>"
        );
      }
      //manipulation code for the butler
      if (finalTranscripts.includes("towel")) {
        alert("butler get towel");
      } else if (finalTranscripts.includes("tooth")) {
        alert("butler get tooth brush");
      }
      console.log(finalTranscripts);
      speechRecogniser.stop();
    };
  });
};

var commands = [
  {
    description: "If my database contains the name of a person say something",
    smart: true, // a Smart command allow you to use wildcard in order to retrieve words that the user should say
    // Ways to trigger the command with the voice
    indexes: [
      "Do you know who is *",
      "I don't know who is *",
      "Is * a good person",
    ],
    // Do something when the commands is triggered
    action: function(i, wildcard) {
      var database = ["Carlos", "Bruce", "David", "Joseph", "Kenny"];

      //If the command "is xxx a good person" is triggered do, else
      if (i == 2) {
        if (database.indexOf(wildcard.trim())) {
          artyom.say("I'm a machine, I dont know what is a feeling");
        } else {
          artyom.say(
            "I don't know who is " +
              wildcard +
              " and i cannot say if is a good person"
          );
        }
      } else {
        if (database.indexOf(wildcard.trim())) {
          artyom.say(
            "Of course i know who is " + wildcard + ". A really good person"
          );
        } else {
          artyom.say(
            "My database is not big enough, I don't know who is " + wildcard
          );
        }
      }
    },
  },
  {
    indexes: ["What time is it", "Is too late"],
    action: function(i) {
      // var i returns the index of the recognized command in the previous array
      if (i == 0) {
        aFunctionThatSaysTheTime(new Date());
      } else if (i == 1) {
        artyom.say("Never is too late to do something my friend !");
      }
    },
  },
];
