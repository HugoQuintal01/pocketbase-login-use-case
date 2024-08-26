import React from 'react';

const AuthContainer: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <section className="auth-section gridrowfull">
      <div className="auth-container col-12 col-t-12 col-d-8 col-ld-6">
        {children}
      </div>
    </section>
  );
}

export default AuthContainer;