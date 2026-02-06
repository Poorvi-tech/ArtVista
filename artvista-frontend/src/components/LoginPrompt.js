import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPrompt = ({ 
  title = "Login Required", 
  message = "Please login to access this feature", 
  showSignupOption = true,
  actionText = "Login Now",
  onAction = null 
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    if (onAction) {
      onAction();
    } else {
      navigate('/login');
    }
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #FFF5F7 0%, #FFE5EC 100%)',
      borderRadius: '15px',
      padding: '30px',
      textAlign: 'center',
      border: '2px dashed #FF6A88',
      margin: '20px 0'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <span style={{ 
          fontSize: '3rem', 
          display: 'block',
          marginBottom: '15px'
        }}>🔒</span>
        <h3 style={{ 
          color: '#FF6A88', 
          marginBottom: '15px',
          fontSize: '1.8rem'
        }}>
          {title}
        </h3>
        <p style={{ 
          color: '#666', 
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          {message}
        </p>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={handleLogin}
          style={{
            background: '#FF6A88',
            color: 'white',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '30px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={e => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={e => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
          }}
        >
          {actionText}
        </button>
        
        {showSignupOption && (
          <button
            onClick={handleSignup}
            style={{
              background: 'transparent',
              color: '#FF6A88',
              border: '2px solid #FF6A88',
              padding: '12px 25px',
              borderRadius: '30px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => {
              e.target.style.background = '#FF6A88';
              e.target.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#FF6A88';
            }}
          >
            Sign Up Free
          </button>
        )}
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        fontSize: '0.9rem', 
        color: '#888' 
      }}>
        Unlock premium features and join our creative community!
      </div>
    </div>
  );
};

export default LoginPrompt;