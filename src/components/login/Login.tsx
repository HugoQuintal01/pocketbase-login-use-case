import React, { useState } from 'react';
import { auth, appleProvider, googleProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from '../../firebase';
import { useNavigate } from 'react-router-dom';

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
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
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

  const handleSocialSignIn = async (provider: any) => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result.user);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert('Password reset email sent! Please check your inbox.');
      setShowResetPassword(false);
    } catch (error) {
      console.error('Error sending password reset email: ', error);
      setResetError('Error sending password reset email. Please try again.');
    }
  };

  return (
    <div className="login-container col-12 col-t-12 col-d-8 col-ld-8">
      <div className='login-container-title col-12'>
        <h2 className='col-12'>{isRegistering ? 'Create Your Account' : 'Sign In to Your Account'}</h2>
        <p>{isRegistering ? 'Join us by creating a new account.' : 'Please sign in to continue.'}</p>
      </div>
      <form onSubmit={handleSubmit} className="form-container col-12">
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
        {!isRegistering && (
          <>
            <button
              type="button"
              onClick={() => setShowResetPassword(!showResetPassword)}
              className="forgot-password-button"
            >
              Forgot Password?
            </button>
            {showResetPassword && (
              <div className="reset-password-container">
                <div className="reset-password-content">
                  <input
                    type="email"
                    name="resetEmail"
                    value={resetEmail}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    className="input-field"
                  />
                  <button type="button" onClick={handleResetPassword} className="submit-button">
                    Send Password Reset Email
                  </button>
                  {resetError && <p className="error">{resetError}</p>}
                </div>
              </div>
            )}
          </>
        )}
      </form>
      <div className='other-sign col-12'>
        <button onClick={() => handleSocialSignIn(appleProvider)} className="apple-signin-button">
          Sign in with Apple
        </button>
        <button onClick={() => handleSocialSignIn(googleProvider)} className="google-signin-button">
          Sign in with Google
        </button>
        <button onClick={() => setIsRegistering(!isRegistering)} className="toggle-auth-button">
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </div>
    </div>
  );
};

export default Login;