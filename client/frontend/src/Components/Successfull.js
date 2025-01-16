import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../Assets/Animation/succesfullyDone.json'; 

const LoadingScreen = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="loading-screen">
      <Lottie options={defaultOptions} height={300} width={300} />
    </div>
  );
};

export default LoadingScreen;
