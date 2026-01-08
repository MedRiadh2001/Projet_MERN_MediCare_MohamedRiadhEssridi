import React, { useContext } from 'react';
import Chat from '../components/Chat';
import { AuthContext } from '../context/AuthContext';

export default function ChatPage(){
  const { user } = useContext(AuthContext);
  return (
    <div style={{padding:16}}>
      <h2>Chat médical</h2>
      <Chat />
    </div>
  )
}
