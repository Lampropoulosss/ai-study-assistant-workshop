import { useState, useEffect } from 'react'
import styles from './ChatHistory.module.css'

export const ChatHistory = () => {
    const [data, setData] = useState<{ date: string, id: string }[]>([])
    const [selectedChat, setSelectedChat] = useState<number | null>(null)

    useEffect(() => {
        const chatHistory = localStorage.getItem('chatHistory');
        if (chatHistory) {
            const parsedData = JSON.parse(chatHistory);
            if (Array.isArray(parsedData)) {
                setData(parsedData);
            }
        }
    }, [])

    return (
        <div className={styles.container}>
            {/* <h1>ChatHistory</h1> */}
            <div>
                { data && data.map((item, index) => {
                    return (
                        <label key={index} className={`${selectedChat == index ? styles.checked : ""}`}><input type="radio" name='chatHistory' onChange={() => setSelectedChat(index)} />{item.date}</label>
                    );
                })}
            </div>
        </div>
    )
}