'use client';
import { useState } from 'react';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📨 Submitting OTP:', otp);

    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: '1234567890', otp }),
    });

    console.log('🧾 Response Status:', res.status);

    let data;
    try {
      data = await res.json();
      console.log('📦 API Response:', data);
    } catch (err) {
      console.error('❌ Error parsing JSON:', err);
    }

    if (res.ok && data?.success) {
      console.log('✅ Redirecting to /profile/setup...');
      window.location.href = '/profile/setup';
    } else {
      console.warn('❌ OTP verification failed:', data?.error);
      alert(data?.error || 'OTP verification failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        required
      />
      <button type="submit">Verify</button>
    </form>
  );
}

