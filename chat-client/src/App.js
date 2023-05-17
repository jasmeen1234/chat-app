import React, { useState } from 'react'
import './App.css';
import Sidebar from './Sidebar'
import Chat from './Chat'
function App() {
   const [privateChats, setPrivateChats]= useState();
   const [tab, setTab] = useState("CHATROOM");

  return (
    <div className="App">
      <Sidebar pc={privateChats} setTab={setTab} tab = {tab}/>
      <Chat setPrivateChats = {setPrivateChats} tab={tab} />
    </div>
  );
}

export default App;
