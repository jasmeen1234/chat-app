import React, { useState, useEffect, useRef } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import MicIcon from "@mui/icons-material/Mic";
import "./css/chat.css";
import SockJS from "sockjs-client";
import { over } from "stompjs";
var stompClient = null;
const Chat = (props) => {
  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState([]);
  const tab = props.tab;


  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the chat container when new messages are added
    scrollToBottom();
  }, [publicChats.length]);

  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  const [userData, setUserData] = useState({
    username: "",
    receivername: "",
    connected: false,
    message: "",
  });
  useEffect(() => {
    console.log(userData);
  }, [userData]);





  const connect = () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe("/chatroom/public", onMessageReceived);
    stompClient.subscribe(
      "/user/" + userData.username + "/private",
      onPrivateMessage
    );
    userJoin();
  };

  const userJoin = () => {
    var chatMessage = {
      senderName: userData.username,
      status: "JOIN",
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  };

  const onMessageReceived = (payload) => {
    var payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "JOIN":
        if (!privateChats.get(payloadData.senderName)) {
          privateChats.set(payloadData.senderName, []);
          setPrivateChats(new Map(privateChats));
          props.setPrivateChats(new Map(privateChats));
        }
        break;
      case "MESSAGE":
        publicChats.push(payloadData);
        setPublicChats([...publicChats]);
        break;
    }
  };

  const onPrivateMessage = (payload) => {
    console.log(payload);
    var payloadData = JSON.parse(payload.body);
    if (privateChats.get(payloadData.senderName)) {
      privateChats.get(payloadData.senderName).push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      let list = [];
      list.push(payloadData);
      privateChats.set(payloadData.senderName, list);
      setPrivateChats(new Map(privateChats));
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };
  const sendValue = () => {
    scrollToBottom();
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: "MESSAGE",
        receiverName: tab,
      };
      console.log(chatMessage);
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
  };

  const sendPrivateValue = () => {
    console.log("jasmeen");
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        receiverName: tab,
        message: userData.message,
        status: "MESSAGE",

      };
      console.log("log", privateChats);
      if (userData.username !== tab) {
        privateChats.get(tab).push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
    console.log("st", stompClient);
  };
  //get time 
  function getTimeInHHMM() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();

    // Add leading zero if hours/minutes is less than 10
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    const timeInHHMM = hours + ':' + minutes;
    return timeInHHMM;
  }

  const timedata = getTimeInHHMM();


  const handleUsername = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, username: value });
  };

  const registerUser = () => {
    connect();
  };
  props.setPrivateChats(privateChats);
   console.log(publicChats);
  console.log("app", tab)
  console.log(userData.username);
  
  return (
    <div ref={chatContainerRef}  className="chat">
      {userData.connected ? (
        <>
          <div className="chat__header">
            <PersonIcon />
            <div className="chat__headerInfo">
              <h3>Room Name</h3>
              <p>Last seen.....</p>
            </div>
            <div className="header__right">
              <IconButton>
                <SearchIcon />
              </IconButton>

              <IconButton>
                <AttachFileIcon />
              </IconButton>

              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </div>
          </div>
          <div  className="chat__body ">
          {publicChats.map((message, index) => (
            

          
            <p key={index}
            className={message.senderName === userData.username ? "chat__message chat__reciever" : "chat__message  chat__recived"} >

                <li type="none"
                  className={`message ${message.senderName === userData.username && "self"
                    }`}
                  key={index}
                >{message.message}</li>

                <span className="chat__name">{message.senderName}</span>

                <span className="chat__time">{timedata}</span>
              </p>
          
                  

          ))}
          </div>
          <div className="chat__footer">
            <EmojiEmotionsIcon />
            <AttachFileIcon />

            <div>
              <input
                type="text" className="input-message"
                placeholder="Type your message"
                value={userData.message}
                onChange={handleMessage}
              />
              <button type="button1" className="send-button" onClick={sendValue}>
                send
              </button>
            </div>
            <MicIcon />
          </div>
        </>
      ) : (
        <div className="register">
          <input
            id="user-name"
            placeholder="Enter your name"
            name="userName"
            value={userData.username}
            onChange={handleUsername}
            margin="normal"
          />
          <button type="button" onClick={registerUser}>
            connect
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat;
