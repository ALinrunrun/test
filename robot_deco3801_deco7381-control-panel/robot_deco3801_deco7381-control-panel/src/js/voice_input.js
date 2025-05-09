// Close window
function closeVoicePopup() {
document.getElementById("voice-popup").style.display = "none";
}

async function sendToLLM(userInput) {
  const response = await fetch('http://localhost:3000/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Authorization not required for local usage
    },
    body: JSON.stringify({
      model: 'llama-3.2-1b-instruct', // You can set this to anything; LM Studio ignores it
      messages: [
        { role: 'system', content: 'You must give responses of type "go_forward()" depending on what is being given. Multiple function calls should be formatted as members of a json file. the function calls that you can use are as follows:- go_forward(num), go_backward(num), turn_left(num), turn_right(num)' },
        { role: 'user', content: userInput }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LLM error: ${error}`);
  }

  const data = await response.json();
  console.log(data.choices[0].message.content.trim());
}

// Sending the contents of a voice input
function sendVoiceCommand() {
let inputText = document.getElementById("voice-input").value;
if (inputText.trim() !== "") {
    sendToLLM(inputText); // Call an existing sendCommand to send a command.
    closeVoicePopup();
} else {
    alert("Please enter or say the command!");
}
}

let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";

recognition.onstart = function () {
  document.getElementById("voice-loading").style.display = "block";
};

recognition.onresult = function (event) {
  let transcript = event.results[0][0].transcript;
  document.getElementById("voice-input").value = transcript;
  document.getElementById("voice-loading").style.display = "none";
  document.getElementById("voice-popup").style.display = "block";
};

// function startVoiceRecognition() {
//     recognition.start();
// }

// speech recognition error
recognition.onerror = function (event) {
  alert("Please retry, an error occurred: " + event.error);
  document.getElementById("voice-loading").style.display = "none";
};

// Activate speech recognition
function startVoiceRecognition() {
  recognition.start();
}

function stopVoiceRecognition() {
  recognition.stop();
  document.getElementById("voice-loading").style.display = "none";
}
