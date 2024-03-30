const { useState } = require("react");


function useChat({api}) {
    let threadId = null;
    const [status, setStatus] = useState('await_message')
    const [messages, setMessages] = useState([])
    const [ input, setInput ] = useState('')
    
    const submitMessage = async (message) => {
        setStatus('in_progress')
        setInput('')
        let data = {
            message: message,
            threadId: threadId
        }
        await updateMessages('user', message)
        const fet = await fetch(api, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        setStatus('await_message')
        fet.json().then(response=>{
            console.log(response)
            threadId = response.threadId
            response.content.map(async res_message=>{
                await updateMessages('assistant', res_message.text.value)
            })
        })
        console.log(fet.body)
        // return response.json(); // parses JSON response into native JavaScript objects
    }

    const updateMessages = async (role, message) => {
        setMessages((prev_messages)=>[...prev_messages, {
            role: role,
            value: message
        }])
    }

    return {
        input, 
        setInput,
        threadId,
        messages,
        status,
        submitMessage
     }
}

module.exports = { useChat }