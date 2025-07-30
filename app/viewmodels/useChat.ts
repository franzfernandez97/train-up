import { useEffect, useState } from 'react';
import { ChatResumen } from '../models/ChatResumen';
import { getChats } from '../services/MensajeService';

export default function useChatViewModel() {
  const [chats, setChats] = useState<ChatResumen[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = async () => {
    setLoading(true);
    const data = await getChats();
    setChats(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return { chats, loading, fetchChats };
}
