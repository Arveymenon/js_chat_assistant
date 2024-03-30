import { useEffect } from 'react';
import './App.css';

import {
  useChat
} from './helper/chat'

function App() {

  const {
    threadId,
    messages,
    status,
    input,
    setInput,
    submitMessage} = useChat({
      api: 'http://localhost:5001/chat'
    })

  const handleSubmit = (e) => {
    e.preventDefault()
    submitMessage(input).then(res => {
      console.log(res)
    })
    return false;
  }

  useEffect(() => {
    console.log("Messages", messages)
    console.log("Status", status)
  }, [messages, status])

  return (
    <>
      Messages
      {messages.length > 0 && messages.map((message, index)=>{
          return <div key={index}> {message.value} </div>
        })}
      <form onSubmit={handleSubmit}>
        <input onChange={(e) => {
          setInput(e.target.value)
        }} />
        <button type="submit"> Submit </button>
      </form>
    </>
  );
}

export default App;