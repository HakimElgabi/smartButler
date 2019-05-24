console.log("js loaded");
var resetBtnProps = function() {
  //resetting button props.
  $("button#btn").css("background-color", "lightblue");
  $("button#btn").addClass("fas fa-microphone");
  $("button#btn").css("font-size", "38px");
  $("button#btn").html("");
  $("#startListening").css("font-size", "16px");
  $(" #startListening").css("margin-top", "3%");
  $("button#btn").hover(
    function() {
      $(this).css("background-color", "rgba(11, 140, 214, 0.76)");
    },
    function() {
      if ($("button#btn").html() === "listening...") {
        $(this).css("background-color", "red");
      } else {
        $(this).css("background-color", "lightblue");
      }
    }
  );
};
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

var artyom;
var roomInit = function() {
  console.log(`This is room ${roomId}`);

  var speechRecogniser = new webkitSpeechRecognition();
  //continues after
  speechRecogniser.continuous = true;
  speechRecogniser.interimResults = true;
  //english /us
  speechRecogniser.lang = "en-US";

  $("button#btnStop").click(function() {
    speechRecogniser.stop();
    resetBtnProps();
    alert("Speech software stopped listening");
    $("p#result").css("font-size", "0px");
  });

  $("button#btn").click((e) => {
    var resultsElement = $("#result");
    //start listening
    $("p#result").css("font-size", "18px");
    speechRecogniser.start();
    console.log("Butler Listening");
    $("button#btn").css("font-size", "18px");
    $("button#btn").removeClass("fas fa-microphone");
    $("button#btn").css("background-color", "red");
    $("#startListening").css("font-size", "0px");
    $("button#btn").html("listening...");

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

        resultsElement.html(
          finalTranscripts +
            "<span style='color:#999'>" +
            interimTranscripts +
            "</span>"
        );
      }
      //manipulation code for the butler
      if (finalTranscripts.includes("towel")) {
        $("p#result").css("color", "red");
        resultsElement.html("A butler will bring you a towel shortly");
        // //resetting button props.
        // $('button#btn').css('background-color', 'lightblue')
        // $('button#btn').addClass('fas fa-microphone');
        // $('button#btn').css('font-size', '38px');
        // $('button#btn').html('');
        // $('#startListening').css('font-size','18px')
        // $(' #startListening').css('margin-top','-1%');
        // $('button#btn').hover(function()
        // {
        //   $(this).css('background-color','rgba(11, 140, 214, 0.76)')
        // }, function(){
        //   $(this).css("background-color", "lightblue");
        // }
        // );
        resetBtnProps();

        $.post("/command", {
          msg: `get towel`,
          room: roomId,
        });

        speechRecogniser.stop();
      } else if (finalTranscripts.includes("tooth")) {
        $("p#result").css("color", "red");
        resultsElement.html("A butler will bring you a toothbrush shortly");
        resetBtnProps();
        $.post("/command", {
          msg: `get towel`,
          room: roomId,
        });
        speechRecogniser.stop();
      } else if (finalTranscripts.includes("dishes")) {
        $("p#result").css("color", "red");
        resultsElement.html("A butler will come to take your dishes shortly");
        resetBtnProps();
        $.post("/command", {
          msg: `get towel`,
          room: roomId,
        });
        speechRecogniser.stop();
      } else if (finalTranscripts.includes("on")) {
        $("p#result").css("color", "red");
        resultsElement.html("Turning On Air Conditioner");
        resetBtnProps();
        $.post("/command", {
          msg: `Turning On Air Conditioner`,
          room: roomId,
        });
        speechRecogniser.stop();
      } else if (finalTranscripts.includes("off")) {
        $("p#result").css("color", "red");
        resultsElement.html("Turning Off Air Conditioner");
        resetBtnProps();
        $.post("/command", {
          msg: `Turning Off Air Conditioner`,
          room: roomId,
        });
        speechRecogniser.stop();
      }
    };
  });
};
