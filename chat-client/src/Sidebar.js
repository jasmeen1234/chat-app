import React, { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import ChatIcon from "@mui/icons-material/Chat";
import SidebarChat from "./SidebarChat";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton } from "@mui/material";
import "./css/sidebar.css";
const Sidebar = (props) => {
  const [userData, setUserData] = useState();
  const tab = props.tab;
  const setTab = props.setTab;

  //   const handleUsername=(event)=>{
  //     const {value}=event.target;
  //     setUserData({...userData,"username": value});
  // }
  const registerUser = () => {
    // connect();
  };
const privatechats= props.pc;
console.log("chat" , props.pc);
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <PersonIcon />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>

          <IconButton>
            <ChatIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchIcon />
          <input
            id="user-name"
            type="text"
            placeholder="start a new chat"
            name="userName"
          />
          <button type="button" onClick={registerUser}>
            connect
          </button>
        </div>
      </div>
      <div className="sidebar__Chats">
        <div className="member-list">
          <ul>
            <li type="none"
              onClick={() => {
                setTab("CHATROOM");
              }}
              className={`member ${tab === "CHATROOM" && "active"}`}
            >
              Chatroom
            </li>
            {privatechats&& [...privatechats.keys()].map((name, index) => (
              <li  key={index} type="none"
                onClick={() => {
                  setTab(name);
                }}
                className={`member ${tab === name && "active"}`}
             
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
