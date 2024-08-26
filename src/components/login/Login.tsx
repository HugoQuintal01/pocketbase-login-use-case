import React, { useState } from 'react';
import { auth, appleProvider, googleProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrengthError, setPasswordStrengthError] = useState<string | null>(null);
  const navigate = useNavigate();  // Initialize useNavigate

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value);

  // Simple password strength validation function
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setPasswordStrengthError(null);

    // Validate password strength
    const strengthError = validatePassword(password);
    if (strengthError) {
      setPasswordStrengthError(strengthError);
      return;
    }

    // Confirm password match
    if (isRegistering && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard'); // Redirect to Dashboard on success
    } catch (err) {
      const errorMessage = (err as Error).message;
      if (errorMessage.includes('auth/email-already-in-use')) {
        setError('The email address you have entered is already associated with an existing account. Please use a different email address or sign in to your account.');
      } else if (errorMessage.includes('auth/wrong-password')) {
        setError('The password you entered is incorrect. Please try again.');
      } else if (errorMessage.includes('auth/user-not-found')) {
        setError('No account found with this email address. Please check your email or register for a new account.');
      } else if (errorMessage.includes('auth/invalid-email')) {
        setError('The email address you entered is invalid. Please enter a valid email address.');
      } else {
        setError('The email address or password you entered is incorrect. Please try again.');
      }
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      console.log(result.user);
      navigate('/dashboard'); // Redirect to Dashboard on success
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result.user);
      navigate('/dashboard'); // Redirect to Dashboard on success
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="login-container col-12 col-t-12 col-d-10 col-ld-6">
      <div className='login-container-title col-12'>
        <h2 className='col-12'>{isRegistering ? 'Create Your Account' : 'Sign In to Your Account'}</h2>
        <p>{isRegistering ? 'Join us by creating a new account.' : 'Please sign in to continue.'}</p>
      </div>
      <form onSubmit={handleSubmit} className="form-container col-12">
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
          required
          className="input-field"
        />
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Password"
          required
          className="input-field"
        />
        {isRegistering && (
          <>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm Password"
              required
              className="input-field"
            />
          </>
        )}
        <button type="submit" className="submit-button">
          {isRegistering ? 'Register' : 'Login'}
        </button>
        {error && <p className="error">{error}</p>}
        {passwordStrengthError && <p className="error">{passwordStrengthError}</p>}
      </form>
      <div className='other-sign col-12'>
        <button onClick={handleAppleSignIn} className="apple-signin-button">
          Sign in with Apple
        </button>
        <button onClick={handleGoogleSignIn} className="google-signin-button">
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