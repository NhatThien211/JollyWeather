/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/Chatbot.tsx
import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, XCircle } from 'lucide-react'

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot: React.FC = () => {
  const [isOpenChat, setOpenChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const newMessages = [...messages, { text: message, sender: 'user' }];
    setMessages(newMessages as Message[]);
    setUserInput('');

    // Call the API to get the bot's response
    const botResponse = await fetchBotResponse(userInput);

    setMessages([
      ...newMessages,
      { text: botResponse, sender: 'bot' },
    ] as Message[]);
  };

  const fetchBotResponse = async (input: string) => {
    const apiUrl = import.meta.env.VITE_BE_API; // Replace with your API
    try {
      setLoading(true)
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });
      const data = await response.json();
      return data.response || 'I did not understand that.';
    } catch (error) {
      console.error('Error fetching bot response:', error);
      return 'Sorry, I encountered an error.';
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const inputValue = e.currentTarget.value.trim(); // Avoids accidental spaces
      if (inputValue) {
        handleSendMessage(inputValue);
      }
    }
  }

  return (
    <div className='flex fixed bottom-4 right-4'>
      {
        !isOpenChat ? <div className=' w-16 h-16 rounded-full bg-green-600 flex items-center justify-center cursor-pointer shadow-lg' onClick={(_e) => setOpenChat(true)}>
          <MessageSquare className='w-8 h-8 dark:text-white' />
        </div> :
          <div className="chatbot-container w-full max-w-md mx-auto bg-white rounded-lg shadow-lg text-black">
            <div className='flex flex-row font-semibold border-b border-gray-300 p-4 w-full'>
              <h2 className='flex w-full items-center'>JollyWeather</h2>
              <span className='hover:bg-gray-200 justify-between items-center font-bold rounded-[100px] cursor-pointer text-xl'
                onClick={(_e) => setOpenChat(false)}>
                  <XCircle className='text-black w-6 h-6'/>
                </span>
                
            </div>

            <div className="messages overflow-y-auto h-[300px] mb-4 pl-4 pr-4 custom-scrollbar">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender === 'user' ? 'text-right' : 'text-left'} mt-4`}>
                  <div
                    className={`message-text ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    style={{ display: 'inline-block', padding: '10px', borderRadius: '8px' }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading ? <div key='loading' className={`message text-left mt-4`}>
                <div
                  className={`message-text bg-gray-200`}
                  style={{ display: 'inline-block', padding: '10px', borderRadius: '8px' }}
                >
                  ...
                </div>
              </div> : <></>}
              <div ref={messagesEndRef} />
            </div>
            <div className="input-area flex gap-2 p-4">
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className="w-full p-2 rounded-l-lg border border-gray-300"
                placeholder="Type a message"
                onKeyDown={handleEnter}
              />
              <button onClick={(_e) => handleSendMessage(userInput ?? '')} className="p-2 !bg-blue-700 text-white rounded-r-lg hover:!bg-purple-700">
                Send
              </button>
            </div>
          </div>
      }
    </div>

  );
};

export default Chatbot;
