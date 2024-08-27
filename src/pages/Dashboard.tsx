import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PocketBase from 'pocketbase';
import Welcome from '../components/welcome/Welcome';
import AuthContainer from '../components/auth-container/AuthContainer';

// Initialize PocketBase client
const pb = new PocketBase('http://127.0.0.1:8090');

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    if (!pb.authStore.isValid || !pb.authStore.model) {
      navigate('/'); // Redirect to home (login page) if the user is not authenticated
    }
  }, [navigate]);

  return (
    <div className="dashboard-page">
      <AuthContainer>
        <Welcome />
      </AuthContainer>
    </div>
  );
};

export default Dashboard;