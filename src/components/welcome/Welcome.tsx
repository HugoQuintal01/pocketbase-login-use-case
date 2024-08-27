import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import { useNavigate } from 'react-router-dom';

// Initialize PocketBase client
const pb = new PocketBase('http://127.0.0.1:8090');

const Welcome: React.FC = () => {
  const user = pb.authStore.model; // Get the current authenticated user
  const [passwords, setPasswords] = useState({ currentForChange: '', newPassword: '', currentForDelete: '' });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    if (!pb.authStore.isValid || !user) {
      navigate('/'); // Redirect to home page if user is not authenticated
    }
  }, [navigate, user]);

  const handleLogout = async () => {
    pb.authStore.clear(); // Log out the user
    navigate('/'); // Redirect to the home page after logout
  };

  const reauthenticate = async (password: string) => {
    if (!user) return false;

    try {
      // Reauthenticate the user by re-logging them in
      await pb.collection('usersAuth').authWithPassword(user.email, password);
      return true;
    } catch (error) {
      setError('Reauthentication failed. Please check your password.');
      return false;
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;

    const reauthenticated = await reauthenticate(passwords.currentForChange);
    if (!reauthenticated) return;

    try {
      // Update the user's password in PocketBase
      await pb.collection('usersAuth').update(user.id, {
        password: passwords.newPassword,
        passwordConfirm: passwords.newPassword,
        oldPassword: passwords.currentForChange,
      });
      setSuccessMessage('Password updated successfully!');
      setPasswords({ ...passwords, currentForChange: '', newPassword: '' });
    } catch (error) {
      setError('Error updating password: ' + (error as Error).message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    const reauthenticated = await reauthenticate(passwords.currentForDelete);
    if (!reauthenticated) return;

    try {
      // Delete the user account in PocketBase
      await pb.collection('usersAuth').delete(user.id);
      alert('Account deleted successfully.');
      handleLogout(); // Log the user out and redirect after account deletion
    } catch (error) {
      setError('Error deleting account: ' + (error as Error).message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error on input change
    setSuccessMessage(null); // Clear success message on input change
  };

  return (
    <div className="welcome-container col-12">
      <h1 className="col-12">Welcome, {user?.name || 'User'}!</h1>
      <p className="col-12">Email: {user?.email}</p>

      <div className="update-info col-12 col-t-12 col-d-10 col-ld-8">
        <h3>Change Password</h3>
        <input
          type="password"
          name="currentForChange"
          placeholder="Current Password"
          value={passwords.currentForChange}
          onChange={handleInputChange}
          className="input-field"
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={passwords.newPassword}
          onChange={handleInputChange}
          className="input-field"
        />
        <button onClick={handleChangePassword} className="submit-button">Update Password</button>
        {successMessage && <p className="success col-12">{successMessage}</p>}
      </div>

      <div className="delete-account col-12 col-t-12 col-d-10 col-ld-8">
        <h3>Delete Account</h3>
        <input
          type="password"
          name="currentForDelete"
          placeholder="Current Password"
          value={passwords.currentForDelete}
          onChange={handleInputChange}
          className="input-field"
        />
        <button onClick={handleDeleteAccount} className="submit-button delete-button">Delete Account</button>
      </div>
      {error && <p className="error col-12">{error}</p>}
      <div className="button-logout col-12">
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </div>
  );
};

export default Welcome;