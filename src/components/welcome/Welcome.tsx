// src/components/welcome/Welcome.tsx
import React, { useEffect } from 'react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to the home page after logout
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/'); // Redirect to home page if user is not authenticated
    }
  }, [navigate]);

  return (
    <div className="welcome-container col-12">
      <h1 className='col-12'>Welcome, {auth.currentUser?.displayName || 'User'}!</h1>
      <p className='col-12'>Email: {auth.currentUser?.email}</p>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default Welcome;