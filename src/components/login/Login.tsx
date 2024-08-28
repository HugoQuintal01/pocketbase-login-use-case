import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import { useNavigate } from 'react-router-dom';

// Initialize PocketBase client
const pb = new PocketBase('http://127.0.0.1:8090');

// Error messages dictionary
const ERROR_MESSAGES = {
  EMAIL_ALREADY_IN_USE: 'The email address you have entered is already associated with an existing account. Please use a different email address or sign in to your account.',
  WRONG_PASSWORD: 'The password you entered is incorrect. Please try again.',
  USER_NOT_FOUND: 'No account found with this email address. Please check your email or register for a new account.',
  INVALID_EMAIL: 'The email address you entered is invalid. Please enter a valid email address.',
  PASSWORD_MISMATCH: 'Passwords do not match',
  WEAK_PASSWORD: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  GENERIC_ERROR: 'The email address or password you entered is incorrect. Please try again.',
};

const Login: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrengthError, setPasswordStrengthError] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
    if (name === 'resetEmail') setResetEmail(value);
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) return ERROR_MESSAGES.WEAK_PASSWORD;
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      return ERROR_MESSAGES.WEAK_PASSWORD;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setPasswordStrengthError(null);

    const strengthError = validatePassword(password);
    if (strengthError) {
      setPasswordStrengthError(strengthError);
      return;
    }

    if (isRegistering && password !== confirmPassword) {
      setError(ERROR_MESSAGES.PASSWORD_MISMATCH);
      return;
    }

    try {
      if (isRegistering) {
        // Register new user with PocketBase
        const data = {
          name,
          email,
          password,
          passwordConfirm: confirmPassword,
        };

        await pb.collection('usersAuth').create(data);
        // Optionally request email verification
        await pb.collection('usersAuth').requestVerification(email);
      } else {
        // Authenticate existing user with PocketBase
        await pb.collection('usersAuth').authWithPassword(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err); // For debugging purposes
      const errorMessage = (err as Error).message;

      if (errorMessage.includes('auth/email-already-in-use')) {
        setError(ERROR_MESSAGES.EMAIL_ALREADY_IN_USE);
      } else if (errorMessage.includes('auth/wrong-password')) {
        setError(ERROR_MESSAGES.WRONG_PASSWORD);
      } else if (errorMessage.includes('auth/user-not-found')) {
        setError(ERROR_MESSAGES.USER_NOT_FOUND);
      } else if (errorMessage.includes('auth/invalid-email')) {
        setError(ERROR_MESSAGES.INVALID_EMAIL);
      } else {
        setError(ERROR_MESSAGES.GENERIC_ERROR);
      }
    }
  };

  // Check if user is already logged in on component mount
  useEffect(() => {
    if (pb.authStore.isValid) {
      navigate('/dashboard'); // Redirect if already authenticated
    }
  }, []);

  const handleSocialSignIn = async (provider: 'google') => {
    try {
      await pb.collection('usersAuth').authWithOAuth2({ provider: 'google' });
      navigate('/dashboard'); // Redirect after successful login
    } catch (err) {
      console.error('Google Sign-In error:', err);
      setError('Google Sign-In failed. Please try again.');
    }
  };

  return (
    <div className="login-container col-12 col-t-12 col-d-8 col-ld-8">
      <div className='login-container-title col-12'>
        <h2 className='col-12'>{isRegistering ? 'Create Your Account' : 'Sign In to Your Account'}</h2>
        <p>{isRegistering ? 'Join us by creating a new account.' : 'Please sign in to continue.'}</p>
      </div>
      <form onSubmit={handleSubmit} className="form-container col-12">
        {isRegistering && (
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleInputChange}
            placeholder="Full Name"
            required
            className="input-field"
          />
        )}
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          placeholder="Email"
          required
          className="input-field"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleInputChange}
          placeholder="Password"
          required
          className="input-field"
        />
        {isRegistering && (
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm Password"
            required
            className="input-field"
          />
        )}
        <button type="submit" className="submit-button">
          {isRegistering ? 'Register' : 'Login'}
        </button>
        {error && <p className="error">{error}</p>}
        {passwordStrengthError && <p className="error">{passwordStrengthError}</p>}
      </form>
      <div className='other-sign col-12'>
        <button onClick={() => handleSocialSignIn('google')} className="google-signin-button">
          Sign in with Google
        </button>
        {/*
        <button className="facebook-signin-button" disabled>
          Sign in with Facebook
        </button>
        */}
        <button onClick={() => setIsRegistering(!isRegistering)} className="toggle-auth-button">
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </div>
    </div>
  );
};

export default Login;