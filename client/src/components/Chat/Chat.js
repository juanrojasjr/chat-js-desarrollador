import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";

import UsersOnline from '../UsersOnline/UsersOnline';
import Messages from '../Messages/Messages';
import Input from '../Input/Input';
import closeIcon from '../../icons/closeIcon.png';

import './Chat.css';

const ENDPOINT = 'localhost:5000';

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);

    socket.emit('join', { name, room }, (error) => {
      if(error === 'teacher' || error === 'student') {
        setRole(error);
      }else{
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);
  
  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div className="columns">
      <div className="video">
        <a href="/" className="btnClose"><img src={closeIcon} alt="close icon" title="Salir del chat" /></a>
        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/N_yuPf1ITjE?rel=0&autoplay=1&loop=1&playlist=N_yuPf1ITjE" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>
      <div className="chat">
          <UsersOnline users={users}/>
          <Messages messages={messages} name={name} role={role} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
  );
}

export default Chat;