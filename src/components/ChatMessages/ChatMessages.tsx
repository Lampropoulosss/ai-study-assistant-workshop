import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { ChatMessage, ChatMessageProps } from '../ChatMessage'
import { ChatHistory } from '../ChatHistory'

import { ApiChatMessage } from '@/services/api'
import { HistoryData } from '../ChatHistory'

export type ChatMessagesProps = Omit<
  React.HTMLProps<HTMLDivElement>,
  'data'
> & {
  data?: Pick<ChatMessageProps, 'message' | 'role' | 'disableAnimation'>[]
  setMessages: React.Dispatch<React.SetStateAction<ApiChatMessage[]>>
  setForceChatBar: React.Dispatch<React.SetStateAction<boolean>>
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  data = [],
  setMessages,
  setForceChatBar,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const messagesRef = useRef(data)
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  useEffect(() => {
    if (!ref.current) return
    if (messagesRef.current.length === data.length) return

    const parent = ref.current.parentElement

    setTimeout(() => {
      parent?.scrollBy({
        top: parent.scrollHeight,
        behavior: 'smooth',
      })
    }, 1000)
  }, [data, selectedChat])

  useEffect(() => {
    if (!ref.current) return
    if (messagesRef.current.length === data.length) return
    
    messagesRef.current = data

    if (selectedChat == null) {
      // New chat
      const chatHistory = localStorage.getItem('chatHistory');
      if (chatHistory) {
        const parsedData: HistoryData[] = JSON.parse(chatHistory);
        if (Array.isArray(parsedData)) {
          const newChat = {
            date: new Date().toLocaleString(),
            id: String(parsedData.length),
            data: data,
          }
          localStorage.setItem('chatHistory', JSON.stringify([...parsedData, newChat]));
          setSelectedChat(parsedData.length);
        }
      } else {
        const newChat = {
          date: new Date().toLocaleString(),
          id: '0',
          data: data,
        }
        localStorage.setItem('chatHistory', JSON.stringify([newChat]));
        setSelectedChat(0);
      }
    } else {
      // Update chat
      const chatHistory = localStorage.getItem('chatHistory');
      if (chatHistory) {
        const parsedData: HistoryData[] = JSON.parse(chatHistory);
        if (Array.isArray(parsedData)) {
          const chatToUpdate = parsedData.find((chat) => chat.id === String(selectedChat));
          if (chatToUpdate) {
            chatToUpdate.data = data;
          }
          localStorage.setItem('chatHistory', JSON.stringify(parsedData));
        }
      }
    }
  }, [data])

  return (
    <div
      {...props}
      ref={ref}
      className={clsx(
        'flex flex-col gap-8 w-full overflow-x-hidden',
        props.className,
      )}
    >
      {data && <ChatHistory setForceChatBar={setForceChatBar} setMessages={setMessages} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />}
      {data.map((message, index) => (
        <ChatMessage
          key={index}
          role={message.role}
          message={message.message}
          disableAnimation={message.disableAnimation || index < data.length - 1}
        />
      ))}
    </div>
  )
}
