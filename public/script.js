let speaker,
  input,
  button,
  name,
  data,
  socket,
  id,
  usersDiv,
  allUsers = new Map();

function setup() {
  noCanvas();
  speaker = new p5.Speech();
  socket = io.connect('http://localhost:3000');

  //Creates elements with parent 'inputDiv'
  inputDivObjects = [
    createP("What's your message?"),
    inputChat = createInput(''),
    createP("What's your username?"),
    inputUsername = createInput(''),
    button = createButton('submit')
  ]
  inputDivObjects.forEach((obj) => {obj.parent('inputDiv')})

  //When user presses on button
  button.mousePressed(() => {socket.emit('usernameSubmit', inputUsername.value()); inputUsername.value('')});

  //Receive ID
  socket.on('giveID', (newID) => {
    id = newID;
    console.log(id + ' got ID')
  });

  //Print Message on client
  socket.on('printMsg', (messageObj) => {
    if (allUsers.get(messageObj.sender) != '') {
      createDiv(allUsers.get(messageObj.sender) + ': ' + messageObj.msg);
    } else {
      createDiv(messageObj.sender + ': ' + messageObj.msg);
    }
    speaker.speak(messageObj.msg)
  });

  //When Someone changed Username and beginning
  socket.on('updateUserMap', (users) => {
    let transitString = JSON.stringify(Array.from(users));
    console.log(transitString);
    let newMap = new Map(JSON.parse(transitString));
    allUsers = newMap;
    console.log(allUsers);
    updateOnlineDiv();
    })
  }//End of Setup


//Press Enter instead of button
function keyPressed() {
  if (keyCode == ENTER) {
    sendMessage();
  }
}
//Send Message
function sendMessage() {
  let chatMsg = inputChat.value();
  if (chatMsg !== '') {
    let messageObj = {
      msg: chatMsg,
      sender: id
    }
    console.log(messageObj.sender + ' is sending:' + messageObj.msg);
    socket.emit('message', messageObj);
    inputChat.value("");
  }
}

//showcase online users
function updateOnlineDiv(){
  $('#onlineDiv').empty();
  $('#onlineDiv').append("<h3>Online Users:</h3>")

  allUsers.forEach((username, userID) => {
    if(username == ''){
        $('#onlineDiv').append(userID + "<br>")
    }else{
      $('#onlineDiv').append(username + "<br>")
    }})
}
