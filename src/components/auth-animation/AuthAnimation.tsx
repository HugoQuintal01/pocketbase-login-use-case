import React, { useRef, useEffect } from "react";
import Lottie from 'lottie-react';
import animationData from '../../assets/lottie_json02.json'; // Update this path

const AuthAnimation: React.FC = () => {
    const lottieRef = useRef<any>(null);

    useEffect(() => {
        if (lottieRef.current) {
            lottieRef.current.setSpeed(0.5); // Adjust this value to control the animation speed
        }
    }, []);

    return (
        <div className="auth-animation-container col-12 col-t-6 col-d-4 col-ld-4">
            <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                lottieRef={lottieRef} // Set reference to the Lottie component
            />
        </div>
    );
};

export default AuthAnimation;