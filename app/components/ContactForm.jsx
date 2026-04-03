'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'support@resend.dev', // Senin email'in
        subject: 'Yeni Destek Mesajı',
        html: `<p>${message}</p>`,
      }),
    });

    setMessage('');
    alert('Mesaj gönderildi!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Destek mesajınız..."
      />
      <button type="submit">Gönder</button>
    </form>
  );
}