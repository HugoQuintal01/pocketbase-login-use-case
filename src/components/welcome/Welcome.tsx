// src/components/welcome/Welcome.tsx
import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const [user, setUser] = useState(() => auth.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate('/'); // Redirect to home page if user is not authenticated
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe(); // Clean up subscription on component unmount
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to the home page after logout
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div className="welcome-container col-12">
      <h1 className='col-12'>Welcome, {user?.displayName || 'User'}!</h1>
      <p className='col-12'>Email: {user?.email}</p>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default Welcome;