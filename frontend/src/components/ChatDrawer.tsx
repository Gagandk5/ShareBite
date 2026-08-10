import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface ChatDrawerProps {
  donationId: string;
  donationName: string;
  receiverId: string;
  receiverName: string;
  onClose: () => void;
}

interface MessageItem {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  sender: { id: string; name: string; role: string };
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  donationId,
  donationName,
  receiverId,
  receiverName,
  onClose
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await apiFetch<MessageItem[]>(`/messages/${donationId}`);
      setMessages(res);
    } catch (err: any) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [donationId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const newMsg = await apiFetch<MessageItem>(`/messages/${donationId}`, {
        method: 'POST',
        body: JSON.stringify({
          receiverId,
          message: text.trim()
        })
      });
      setMessages((prev) => [...prev, newMsg]);
      setText('');
    } catch (err: any) {
      showToast('Failed to send message', 'error');
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="font-bold text-sm leading-tight">{receiverName}</h3>
            <p className="text-[11px] text-slate-300 truncate max-w-[220px]">Re: {donationName}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-slate-300 hover:text-white transition">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
        {loading ? (
          <p className="text-xs text-slate-400 text-center py-6">Loading messages...</p>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">No messages yet.</p>
            <p className="text-[11px] text-slate-400">Coordinate pickup timing and instructions safely here.</p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.senderId === user?.id;
            return (
              <div
                key={m.id}
                className={`flex flex-col max-w-[80%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <span className="text-[10px] text-slate-400 font-semibold mb-0.5 px-1">
                  {m.sender.name} ({m.sender.role})
                </span>
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.message}
                </div>
                <span className="text-[9px] text-slate-400 mt-1">
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Input */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
        <button
          type="submit"
          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
