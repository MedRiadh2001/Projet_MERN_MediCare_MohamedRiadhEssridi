import React, { useState, useRef, useEffect } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]); // {role: 'user'|'assistant', text: string}
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

  const buildContext = (n = 6) => {
    const slice = messages.slice(-n);
    if (!slice.length) return '';
    return 'Résumé précédent :\n' + slice.map(m => `${m.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${m.text}`).join('\n');
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const context = buildContext(6);

    try {
      const res = await fetch(`${API_BASE}/api/ai/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context })
      });
      const data = await res.json();
      const assistantText = data && data.reply ? data.reply : 'Erreur : pas de réponse';
      const assistantMsg = { role: 'assistant', text: assistantText };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Erreur réseau' }]);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="container">
      <div className="card">
        <div className="card-body d-flex flex-column" style={{height: '520px'}}>
          <h5 className="card-title">Assistant médical</h5>
          <div ref={scrollRef} className="flex-grow-1 overflow-auto mb-3">
            {messages.length === 0 && (
              <div className="text-muted text-center py-5">Posez une question médicale — l'assistant vous répondra.</div>
            )}
            <div className="d-flex flex-column gap-3">
              {messages.map((m, i) => (
                <div key={i} className={`d-flex ${m.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                  <div className={`p-2 rounded`} style={{background: m.role === 'user' ? '#e6f3ff' : '#f1f5f9', maxWidth: '78%'}}>
                    <div className="small text-muted">{m.role === 'user' ? 'Vous' : 'Assistant'}</div>
                    <div>{m.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <textarea className="form-control mb-2" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKeyDown} placeholder="Tapez votre message (Entrée pour envoyer)" />
            <div className="d-flex gap-2">
              <button className="btn btn-primary" onClick={sendMessage}>Envoyer</button>
              <button className="btn btn-outline-secondary" onClick={() => { setMessages([]); setInput(''); }}>Reset</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
