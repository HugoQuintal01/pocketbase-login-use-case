import React from "react";
import AuthAnimation from "../auth-animation/AuthAnimation";
import Login from "../login/Login";

const AuthContainer = () => {
    return(
        <section className="auth-section gridrowfull">
            <div className="auth-container col-8">
                <AuthAnimation />
                <Login />
            </div>
        </section>
    );
}

export default AuthContainer;