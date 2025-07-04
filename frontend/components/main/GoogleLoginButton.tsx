'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleLoginButton() {
  useEffect(() => {
    const initialize = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-login-button'),
          {
            theme: 'outline',
            size: 'large',
            shape: 'rectangular',
            text: 'signin_with',
            width: '335px',
          }
        );
      }
    };

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initialize;
    document.body.appendChild(script);
  }, []);

  const handleCredentialResponse = async (response: any) => {
    const idToken = response.credential;

    const res = await fetch("http://localhost:8000/api/users/auth/google/", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id_token: idToken }),
    });

    if (res.ok) {
      window.location.href = '/';
    } else {
      console.error('Google login failed');
    }
  };

  return <div id="google-login-button" />;
}
