import { useEffect, useRef, useState } from 'react';
import './App.css';

//npm start (in client)
function formatTime(date = new Date()) {
  try {
    const opts = { hour: 'numeric', minute: '2-digit' };
    return new Intl.DateTimeFormat('en-US', { ...opts, timeZone: 'America/New_York' }).format(date);
  } catch (e) {
    const d = date;
    const h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }
}

// return last activity timestamp for a chat: last message timestamp if present, else chat.timestamp
const lastActivityTimestamp = (chat) => {
  if (!chat) return 0;
  const msgs = Array.isArray(chat.messages) ? chat.messages : [];
  for (let i = msgs.length - 1; i >= 0; i--) {
    const m = msgs[i];
    if (m && Number.isFinite(m.timestamp)) return m.timestamp;
  }
  return Number.isFinite(chat.timestamp) ? chat.timestamp : 0;
};
const loadChatsFromStorage = () => {
  const saved = localStorage.getItem('chats');
  if (!saved) return chatData;

  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return chatData;

    const defaultById = new Map(chatData.map((chat) => [chat.id, chat]));

    const mergedChats = parsed.map((chat) => {
      const def = defaultById.get(chat.id);
      const timestamp = Number.isFinite(chat.timestamp) ? chat.timestamp : def?.timestamp ?? Date.now();
      const time = chat.time && String(chat.time).trim()
        ? chat.time
        : def?.time || formatTime(new Date(timestamp));

      if (!def) {
        return {
          ...chat,
          timestamp,
          time,
        };
      }

      return {
        ...def,
        ...chat,
        timestamp,
        time,
        messages: Array.isArray(chat.messages) && chat.messages.length > 0 ? chat.messages : def.messages,
      };
    });

    chatData.forEach((chat) => {
      if (!mergedChats.some((savedChat) => savedChat.id === chat.id)) {
        mergedChats.push(chat);
      }
    });

    return mergedChats;
  } catch (error) {
    console.error('Failed to load chats from localStorage', error);
    return chatData;
  }
};

const chatData = [
  {
    id: 1,
    name: 'Claire Mason',
    snippet: 'Sounds great. I’ll send that by 3pm.',
    time: '11:22',
    timestamp: Date.now() - 180 * 60 * 1000,
    unread: 2,
    seen: false,
    status: 'Online',
    messages: [
      { id: 1, sender: 'them', text: 'Can you review the new flow?', time: '10:05 AM', timestamp: Date.now() - 175 * 60 * 1000 },
      { id: 2, sender: 'me', text: 'Yes — I’m looking at it now.', time: '10:08 AM', timestamp: Date.now() - 172 * 60 * 1000 },
      { id: 3, sender: 'them', text: 'Great, I’ll update the prototype.', time: '10:11 AM', timestamp: Date.now() - 170 * 60 * 1000 },
    ],
  },
  {
    id: 2,
    name: 'Team Sync',
    snippet: 'Meeting moved to 10:00 tomorrow.',
    time: '09:14',
    timestamp: Date.now() - 300 * 60 * 1000,
    unread: 0,
    seen: false,
    status: 'Active',
    messages: [
      { id: 1, sender: 'them', text: 'The standup is at 9:45.', time: '09:02 AM', timestamp: Date.now() - 295 * 60 * 1000 },
      { id: 2, sender: 'me', text: 'I’ll be there.', time: '09:05 AM', timestamp: Date.now() - 292 * 60 * 1000 },
      { id: 3, sender: 'them', text: 'Don’t forget the demo notes.', time: '09:10 AM', timestamp: Date.now() - 290 * 60 * 1000 },
    ],
  },
  {
    id: 3,
    name: 'Jordan Patel',
    snippet: 'Which design should I use?',
    time: 'Yesterday',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    unread: 1,
    seen: false,
    status: 'Away',
    messages: [
      { id: 1, sender: 'them', text: 'Which design should I use for the profile page?', time: 'Yesterday', timestamp: Date.now() - (24 * 60 * 60 * 1000) + 60 * 60 * 1000 },
      { id: 2, sender: 'me', text: 'Let’s go with the cleaner dark version.', time: 'Yesterday', timestamp: Date.now() - (24 * 60 * 60 * 1000) + 2 * 60 * 60 * 1000 },
    ],
  },
  {
    id: 4,
    name: 'Tony Stark',
    snippet: 'Joined the conversation',
    time: formatTime(new Date()),
    timestamp: Date.now(),
    unread: 1,
    seen: false,
    status: 'Active',
    messages: [{ id: 1, sender: 'system', text: '', time: formatTime(new Date()), timestamp: Date.now() }],
  },
];

// sample followed users (not necessarily in chats yet)
const followedUsersData = [
  { id: 'f1', name: 'Alex Rivera', status: 'Online' },
  { id: 'f2', name: 'Sam Kim', status: 'Away' },
  { id: 'f3', name: 'Taylor Nguyen', status: 'Active' },
];

function App() {
  const [chats, setChats] = useState(() =>
    loadChatsFromStorage().sort((a, b) => lastActivityTimestamp(b) - lastActivityTimestamp(a))
  );
  const [selectedChatId, setSelectedChatId] = useState(chatData[0].id);
  const [draft, setDraft] = useState('');
  const messageAreaRef = useRef(null);
  const [query, setQuery] = useState('');
  const [followedUsers] = useState(followedUsersData);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId) || chats[0];
  const visibleMessages = selectedChat.messages.filter((message) => message.sender !== 'system');

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [selectedChatId, visibleMessages.length]);

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
              time: formatTime(new Date()),
              timestamp: Date.now(),
        };

        return {
          ...chat,
          snippet: trimmed,
          time: formatTime(new Date()),
              timestamp: Date.now(),
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
      currentChats.map((chat) => (chat.id === chatId ? { ...chat, unread: 0, seen: true } : chat))
    );
  };

  const handleCreateOrOpen = (entry) => {
    // if entry is a chat object, open it; if it's a followed user, create a new chat
    if (entry.messages) {
      handleSelectChat(entry.id);
      setQuery('');
      return;
    }

    // followed user -> create new chat if not exists
    const exists = chats.find((c) => c.name === entry.name);
    if (exists) {
      handleSelectChat(exists.id);
      setQuery('');
      return;
    }

    const now = Date.now();
    const newChat = {
      id: now,
      name: entry.name,
      snippet: 'Joined the conversation',
      time: formatTime(new Date(now)),
      timestamp: now,
      unread: 0,
      status: entry.status || 'Online',
      messages: [{ id: 1, sender: 'system', text: '', time: formatTime(new Date(now)), timestamp: now }],
      followed: true,
    };

    setChats((prev) => [newChat, ...prev]);
    setSelectedChatId(newChat.id);
    setQuery('');
  };

  const searchLower = query.trim().toLowerCase();
  const matches =
    searchLower && searchLower.length > 0
      ? [
          ...chats.filter((c) => c.name.toLowerCase().includes(searchLower)),
          ...followedUsers.filter((u) => u.name.toLowerCase().includes(searchLower) && !chats.some((c) => c.name === u.name)),
        ]
      : [];

  return (
    <div className="App">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div>
            <p className="subtitle">Messaging App</p>
            <h1>Messages</h1>
          </div>
          <button className="new-chat-button" type="button">
            + New
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search chats or followed users"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search chats or followed users"
          />

          {query.trim() !== '' && (
            <ul className="search-results" role="listbox">
              {matches.length === 0 ? (
                <li className="search-result no-results">No users found</li>
              ) : (
                matches.map((res) => (
                  <li
                    key={res.id}
                    className="search-result"
                    role="option"
                    onClick={() => handleCreateOrOpen(res)}
                  >
                    <div className="search-avatar">{res.name.charAt(0)}</div>
                    <div className="search-info">
                      <strong>{res.name}</strong>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <ul className="chat-list">
          {(() => {
            const selected = chats.find((c) => c.id === selectedChatId);
            const others = chats.filter((c) => c.id !== selectedChatId);
            const sorted = others
              .slice()
              .sort((a, b) => lastActivityTimestamp(b) - lastActivityTimestamp(a));
            const ordered = selected ? [selected, ...sorted] : sorted;

            return ordered.map((chat) => (
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
                <div className="chat-avatar">
                  {chat.name.charAt(0)}
                  <span className={`status-dot ${chat.status.toLowerCase()}`} aria-hidden />
                </div>
                <div className="chat-info">
                  <div className="chat-name-row">
                    <strong>{chat.name}</strong>
                    <span className="chat-time">{chat.time}</span>
                  </div>
                  <p className="chat-snippet">{chat.snippet}</p>
                </div>
                {!chat.seen && chat.unread > 0 && <span className="chat-unread">{chat.unread}</span>}
              </li>
            ));
          })()}
        </ul>
      </aside>

      <main className="chat-view">
        <header className="chat-header">
          <div>
            <h2>{selectedChat.name}</h2>
          </div>
          <span className={`chat-status ${selectedChat.status.toLowerCase()}`}>{selectedChat.status}</span>
        </header>

        <section className="message-area" ref={messageAreaRef}>
          {visibleMessages.length === 0 ? (
            <div className="message-placeholder">
              <p>Send a message and say "Hi!"</p>
            </div>
          ) : (
            visibleMessages.map((message) => (
              <div
                key={message.id}
                className={`message-row ${message.sender === 'me' ? 'message-sent' : 'message-received'}`}
              >
                <div className="message-bubble">
                  <p>{message.text}</p>
                  <span>{message.time}</span>
                </div>
              </div>
            ))
          )}
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
