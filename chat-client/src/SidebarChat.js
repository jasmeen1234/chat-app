import React,{useState, useEffect} from 'react'
import PersonIcon from '@mui/icons-material/Person';
import './css/sidebar.css'
function SidebarChat ({addnewchat})  {
    const[seed, setSeed]=useState("");
    useEffect(()=>{
setSeed(Math.floor(Math.random() * 5000))
    },[])
   const chat = 
   <div className="sidebar__chat">
    <PersonIcon />
    <div className="sidebar__chatInfo">
    <h2>react </h2>
    <p>last Message...</p>
    </div>
   </div> 
   

   const newChat = <div className="sidebar__chat">
           <h2>Add New Chat</h2>
           </div>
  return (
    <>
      { addnewchat? chat : newChat};

      </>


    )
    
  
   
  
}

export default SidebarChat
