import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import Welcome from '../components/welcome/Welcome';
import AuthContainer from '../components/auth-container/AuthContainer';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/'); // Redirect to dashboard if the user is logged in
    }
  }, [navigate]);

  return (
    <div className="login-page">
      <AuthContainer>
        <Welcome />
      </AuthContainer>
    </div>
  );
};

export default Dashboard;