// src/pages/Home.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import AuthContainer from '../components/auth-container/AuthContainer';
import AuthAnimation from '../components/auth-animation/AuthAnimation';
import Login from '../components/login/Login';

const Home: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      console.log('User Info:', auth.currentUser); // Print user info to the console
      navigate('/dashboard'); // Redirect to dashboard if the user is logged in
    }
  }, [navigate]);

  return (
    <div className="login-page">
      <AuthContainer>
        
        <Login />
      </AuthContainer>
    </div>
  );
};

export default Home;