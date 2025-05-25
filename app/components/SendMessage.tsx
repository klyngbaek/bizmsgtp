'use client';

import { useState } from 'react';

export default function SendMessage({ sendHandler }) {

    const [currentMessageText, setCurrentMessageText] = useState('');

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            setCurrentMessageText('');
            sendHandler(event.target.value);
        }
    };

    const handleChange = (event) => {
        setCurrentMessageText(event.target.value);
    };

    return (
        <>
            <input value={currentMessageText} placeholder="Type here to send message" onChange={handleChange} onKeyDown={handleKeyDown} className="w-48 border border-slate-200 rounded-md px-1 py-1 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" />
        </>
    );
}
