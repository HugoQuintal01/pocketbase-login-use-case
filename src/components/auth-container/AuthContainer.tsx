// src/components/auth-container/AuthContainer.tsx
import React from 'react';

interface AuthContainerProps {
  children: React.ReactNode; // Define children prop
}

const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  return (
    <section className="auth-section gridrowfull">
      <div className="auth-container col-8">
        {children}
      </div>
    </section>
  );
}

export default AuthContainer;