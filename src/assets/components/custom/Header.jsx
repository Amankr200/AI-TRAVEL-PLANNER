import React from "react";
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

function Header() {
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      localStorage.setItem('token', tokenResponse.access_token);
      navigate('/create-trip');
    },
    onError: () => {
      alert('Login Failed');
    }
  });

  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>
      <img src='/logo.svg' alt='Logo' />
      <div>
        <button className="text-orange-500" onClick={() => login()}>Sign In</button>
      </div>
    </div>
  );
}

export default Header;