import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { signOut, updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const [user, setUser] = useState(() => auth.currentUser);
  const [newPassword, setNewPassword] = useState('');
  const [currentPasswordForChange, setCurrentPasswordForChange] = useState('');
  const [currentPasswordForDelete, setCurrentPasswordForDelete] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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

  const reauthenticate = async (password: string) => {
    if (!user || !password) return false;
    const credential = EmailAuthProvider.credential(user.email!, password);
    try {
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error) {
      setError('Reauthentication failed. Please check your password.');
      return false;
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;

    const reauthenticated = await reauthenticate(currentPasswordForChange);
    if (!reauthenticated) return;

    try {
      await updatePassword(user, newPassword);
      setSuccessMessage('Password updated successfully!');
      setCurrentPasswordForChange('');
      setNewPassword('');
    } catch (error) {
      setError('Error updating password: ' + (error as Error).message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    const reauthenticated = await reauthenticate(currentPasswordForDelete);
    if (!reauthenticated) return;

    try {
      await deleteUser(user);
      alert('Account deleted successfully.');
      window.location.reload(); // Reload the page after account deletion
    } catch (error) {
      setError('Error deleting account: ' + (error as Error).message);
    }
  };

  return (
    <div className="welcome-container col-12">
      <h1 className='col-12'>Welcome, {user?.displayName || 'User'}!</h1>
      <p className='col-12'>Email: {user?.email}</p>

      <div className="update-info col-12 col-t-12 col-d-10 col-ld-8">
        <h3>Change Password</h3>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPasswordForChange}
          onChange={(e) => setCurrentPasswordForChange(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input-field"
        />
        <button onClick={handleChangePassword} className="submit-button">Update Password</button>
        {successMessage && <p className="success col-12">{successMessage}</p>}
      </div>

      <div className="delete-account col-12 col-t-12 col-d-10 col-ld-8">
        <h3>Delete Account</h3>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPasswordForDelete}
          onChange={(e) => setCurrentPasswordForDelete(e.target.value)}
          className="input-field"
        />
        <button onClick={handleDeleteAccount} className="submit-button delete-button">Delete Account</button>
      </div>
      {error && <p className="error col-12">{error}</p>}
      <div className='button-logout col-12'>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </div>
  );
};

export default Welcome;