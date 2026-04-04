'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'ozgurergene@gmail.com', // Senin email'in
          subject: `Yeni Destek Mesajı: ${email}`,
          html: `<p><strong>Gönderen:</strong> ${email}</p><p><strong>Mesaj:</strong></p><p>${message}</p>`,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Mesaj gönderildi!');
        setEmail('');
        setMessage('');
      } else {
        alert('Hata: ' + data.error);
      }
    } catch (error) {
      alert('Hata: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '20px auto' }}>
      <div style={{ marginBottom: '10px' }}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Mesaj:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', minHeight: '100px' }}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Gönderiliyor...' : 'Gönder'}
      </button>
    </form>
  );
}