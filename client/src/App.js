import { useEffect, useRef, useState } from 'react';
import './App.css';

//npm start (in client)
const chatData = [
  {
    id: 1,
    name: 'Claire Mason',
    snippet: 'Sounds great. I’ll send that by 3pm.',
    time: '11:22',
    unread: 2,
    status: 'Online',
    messages: [
      { id: 1, sender: 'them', text: 'Can you review the new flow?', time: '10:05 AM' },
      { id: 2, sender: 'me', text: 'Yes — I’m looking at it now.', time: '10:08 AM' },
      { id: 3, sender: 'them', text: 'Great, I’ll update the prototype.', time: '10:11 AM' },
    ],
  },
  {
    id: 2,
    name: 'Team Sync',
    snippet: 'Meeting moved to 10:00 tomorrow.',
    time: '09:14',
    unread: 0,
    status: 'Active',
    messages: [
      { id: 1, sender: 'them', text: 'The standup is at 9:45.', time: '09:02 AM' },
      { id: 2, sender: 'me', text: 'I’ll be there.', time: '09:05 AM' },
      { id: 3, sender: 'them', text: 'Don’t forget the demo notes.', time: '09:10 AM' },
    ],
  },
  {
    id: 3,
    name: 'Jordan Patel',
    snippet: 'Which design should I use?',
    time: 'Yesterday',
    unread: 1,
    status: 'Away',
    messages: [
      { id: 1, sender: 'them', text: 'Which design should I use for the profile page?', time: 'Yesterday' },
      { id: 2, sender: 'me', text: 'Let’s go with the cleaner dark version.', time: 'Yesterday' },
    ],
  },
];

function App() {
  const [chats, setChats] = useState(chatData);
  const [selectedChatId, setSelectedChatId] = useState(chatData[0].id);
  const [draft, setDraft] = useState('');
  const messageAreaRef = useRef(null);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId) || chats[0];

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [selectedChatId, selectedChat.messages.length]);

  const handleSend = (event) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;

    setChats((currentChats) =>
      currentChats.map((chat) => {
        if (chat.id !== selectedChatId) return chat;

        const nextMessage = {
          id: chat.messages.length + 1,
          sender: 'me',
          text: trimmed,
          time: 'Now',
        };

        return {
          ...chat,
          snippet: trimmed,
          time: 'Now',
          unread: 0,
          messages: [...chat.messages, nextMessage],
        };
      })
    );

    setDraft('');
  };

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    setChats((currentChats) =>
      currentChats.map((chat) =>
        chat.id === chatId ? { ...chat, unread: 0 } : chat
      )
    );
  };

  return (
    <div className="App">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div>
            <p className="subtitle">Your conversations</p>
            <h1>Messaging</h1>
          </div>
          <button className="new-chat-button" type="button">
            + New
          </button>
        </div>

        <div className="search-box">
          <input type="text" placeholder="Search chats" />
        </div>

        <ul className="chat-list">
          {chats.map((chat) => (
            <li
              key={chat.id}
              className={`chat-item ${chat.id === selectedChatId ? 'active' : ''}`}
              onClick={() => handleSelectChat(chat.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  handleSelectChat(chat.id);
                }
              }}
            >
              <div className="chat-avatar">{chat.name.charAt(0)}</div>
              <div className="chat-info">
                <div className="chat-name-row">
                  <strong>{chat.name}</strong>
                  <span className="chat-time">{chat.time}</span>
                </div>
                <p className="chat-snippet">{chat.snippet}</p>
              </div>
              {chat.unread > 0 && <span className="chat-unread">{chat.unread}</span>}
            </li>
          ))}
        </ul>
      </aside>

      <main className="chat-view">
        <header className="chat-header">
          <div>
            <p className="subtitle">Chat with</p>
            <h2>{selectedChat.name}</h2>
          </div>
          <span className="chat-status">{selectedChat.status}</span>
        </header>

        <section className="message-area" ref={messageAreaRef}>
          {selectedChat.messages.map((message) => (
            <div
              key={message.id}
              className={`message-row ${message.sender === 'me' ? 'message-sent' : 'message-received'}`}
            >
              <div className="message-bubble">
                <p>{message.text}</p>
                <span>{message.time}</span>
              </div>
            </div>
          ))}
        </section>

        <form className="message-form" onSubmit={handleSend}>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write a message..."
            aria-label="Write a message"
          />
          <button type="submit">Send</button>
        </form>
      </main>
    </div>
  );
}

export default App;
