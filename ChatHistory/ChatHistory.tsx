import { useState, useEffect } from 'react'
import styles from './ChatHistory.module.css'
import { ApiChatMessage } from '@/services/api'


type ChatHistoryProps = {
    setMessages: React.Dispatch<React.SetStateAction<ApiChatMessage[]>>

    selectedChat: number | null;
    setSelectedChat: React.Dispatch<React.SetStateAction<number | null>>;

    setForceChatBar: React.Dispatch<React.SetStateAction<boolean>>
}

export type HistoryData = {
    date: string;
    id: string;
    data: ApiChatMessage[];
}

export const ChatHistory = ({ setMessages, selectedChat, setSelectedChat, setForceChatBar }: ChatHistoryProps) => {
    const [data, setData] = useState<HistoryData[]>([])

    useEffect(() => {
        const chatHistory = localStorage.getItem('chatHistory');
        if (chatHistory) {
            const parsedData: HistoryData[] = JSON.parse(chatHistory);
            if (Array.isArray(parsedData)) {
                setData(parsedData);
                setMessages(parsedData.find((chat) => chat.id === String(selectedChat))?.data || []);
            }
        }
    }, [selectedChat])

    return (
        <div className={styles.container}>
            {/* <h1>ChatHistory</h1> */}
            <div>
                { data && data.map((item, index) => {
                    return (
                        <label onClick={() => {
                            setSelectedChat(index);
                            setForceChatBar(true);
                        }} key={index} className={`${selectedChat == index ? styles.checked : ""}`}><input type="radio" name='chatHistory' onChange={() => setSelectedChat(index)} />{item.date}</label>
                    );
                })}
            </div>
        </div>
    )
}