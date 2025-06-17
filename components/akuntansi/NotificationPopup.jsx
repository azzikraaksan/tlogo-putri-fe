import React, { useEffect, useState, useRef, useCallback } from 'react'; 
import { CheckCircle, XCircle, X } from 'lucide-react';

const NotificationPopup = ({ message, type, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const progressBarRef = useRef(null); 
  const timerRef = useRef(null); 

  const startProgressBar = useCallback(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.transition = 'none';
      progressBarRef.current.style.width = '100%';
      void progressBarRef.current.offsetWidth; 

      progressBarRef.current.style.transition = `width ${duration}ms linear`;
      progressBarRef.current.style.width = '0%';
    }
  }, [duration]); 
  useEffect(() => {
    if (message) {
      setIsVisible(true);
      setIsExiting(false);
      startProgressBar(); 
      timerRef.current = setTimeout(() => {
        setIsExiting(true);
        const fadeOutTimer = setTimeout(() => {
          setIsVisible(false);
          if (progressBarRef.current) {
            progressBarRef.current.style.transition = 'none';
            progressBarRef.current.style.width = '100%';
          }
        }, 500);
        return () => clearTimeout(fadeOutTimer);
      }, duration);

      return () => {
        clearTimeout(timerRef.current);
        if (progressBarRef.current) {
          progressBarRef.current.style.transition = 'none';
          progressBarRef.current.style.width = '100%';
        }
      };
    } else {
      setIsVisible(false);
      setIsExiting(false);
      if (progressBarRef.current) {
        progressBarRef.current.style.transition = 'none';
        progressBarRef.current.style.width = '100%';
      }
    }
  }, [message, duration, startProgressBar]); 

  if (!isVisible && !isExiting) return null;

  const baseStyle = {
    position: 'fixed',
    top: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 100,
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: 'auto',
    minWidth: '250px',
    maxWidth: 'calc(100% - 2rem)',
    transition: 'all 0.5s ease-in-out',
    opacity: isExiting ? 0 : 1,
    transform: `translateX(-50%) translateY(${isExiting ? '-20px' : '0'})`,
  };

  const progressBarContainerStyle = {
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    height: '4px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '0 0 0.5rem 0.5rem',
    overflow: 'hidden',
  };

  const progressBarFillingStyle = {
    height: '100%',
  };

  let iconComponent;
  let currentBgColor;
  let currentProgressBarColor;
  let textColor;

  if (type === 'success') {
    iconComponent = <CheckCircle size={20} color="#22c55e" />;
    currentBgColor = 'white';
    currentProgressBarColor = '#22c55e';
    textColor = '#16a34a';
  } else { 
    iconComponent = <XCircle size={20} color="#ef4444" />;
    currentBgColor = 'white';
    currentProgressBarColor = '#ef4444';
    textColor = '#b91c1c';
  }

  return (
    <div
      style={{ ...baseStyle, backgroundColor: currentBgColor, color: textColor }}
      role="alert"
    >
      {iconComponent}
      <span style={{ flexGrow: 1 }}>{message}</span>
      <button
        onClick={() => {
          clearTimeout(timerRef.current); 
          setIsExiting(true); 
          if (progressBarRef.current) {
            progressBarRef.current.style.transition = 'none';
            progressBarRef.current.style.width = '100%';
          }
          setTimeout(() => setIsVisible(false), 500); 
        }}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#9ca3af',
          padding: '0.25rem',
          borderRadius: '50%',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <X size={18} />
      </button>

      <div style={progressBarContainerStyle}>
        <div
          ref={progressBarRef}
          style={{ ...progressBarFillingStyle, backgroundColor: currentProgressBarColor }}
        ></div>
      </div>
    </div>
  );
};

export default NotificationPopup;