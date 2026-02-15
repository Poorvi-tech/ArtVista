import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
    }
    
    setLoading(false);
  };

  const handleGoogleCallback = useCallback(async (response) => {
    setLoading(true);
    setError('');

    try {
      const result = await signInWithGoogle(response.credential);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    }

    setLoading(false);
  }, [signInWithGoogle, navigate]);

  useEffect(() => {
    // Initialize Google Sign-In
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large' }
      );
    }
  }, [handleGoogleCallback]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)"
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        maxWidth: '900px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 15px 50px rgba(0,0,0,0.2)',
      }}>
        {/* Left side - Art showcase */}
        <div style={{
          flex: 1,
          backgroundColor: '#FF6A88',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            marginBottom: '20px',
            fontWeight: 'bold'
          }}>
            Welcome Back!
          </h2>
          <p style={{
            fontSize: '1.2rem',
            lineHeight: '1.6',
            maxWidth: '400px',
            opacity: 0.9
          }}>
            Join our creative community. Unlock exclusive art experiences, personalized recommendations, and interactive features.
          </p>
          <div style={{
            marginTop: '30px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '25px',
            maxWidth: '350px'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                fontSize: '1.5rem'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold' }}>A</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)' }}>Art Gallery</div>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                fontSize: '1.5rem'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold' }}>G</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)' }}>Interactive Games</div>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                fontSize: '1.5rem'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold' }}>L</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)' }}>Learning Paths</div>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                fontSize: '1.5rem'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold' }}>C</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)' }}>Community</div>
            </div>
          </div>
        </div>
        
        {/* Right side - Login form */}
        <div style={{
          flex: 1,
          padding: '50px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ 
              color: '#333', 
              fontSize: "2.2rem",
              fontWeight: '700',
              marginBottom: "8px"
            }}>
              Sign in to ArtVista
            </h1>
            <p style={{ 
              color: "#666",
              fontSize: '1rem'
            }}>
              Access your personalized art experience
            </p>
          </div>
          
          {error && (
            <div style={{
              padding: '12px',
              borderRadius: '10px',
              background: '#FFE5E5',
              color: '#FF0000',
              textAlign: 'center',
              border: '1px solid #FFCCCC',
              marginBottom: '15px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}
          
          {/* Google Sign In Button */}
          <div 
            id="google-signin-button"
            style={{
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'center'
            }}
          ></div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              flex: 1,
              height: '1px',
              backgroundColor: '#eee'
            }}></div>
            <span style={{
              padding: '0 15px',
              color: '#777',
              fontSize: '0.9rem'
            }}>
              OR
            </span>
            <div style={{
              flex: 1,
              height: '1px',
              backgroundColor: '#eee'
            }}></div>
          </div>
          
          <form 
            onSubmit={handleLogin} 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div>
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  borderRadius: '10px',
                  border: '2px solid #eee',
                  fontSize: '1rem',
                  outline: "none",
                  transition: "border 0.3s",
                  boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = "#FF6A88"}
                onBlur={e => e.target.style.borderColor = "#eee"}
                required
              />
            </div>

            <div>
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  borderRadius: '10px',
                  border: '2px solid #eee',
                  fontSize: '1rem',
                  outline: "none",
                  transition: "border 0.3s",
                  boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = "#FF6A88"}
                onBlur={e => e.target.style.borderColor = "#eee"}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              style={{
                padding: '15px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)',
                color: '#fff',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: "1.1rem",
                boxShadow: "0 4px 15px rgba(255, 106, 136, 0.3)",
                transition: "all 0.3s",
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 20px rgba(255, 106, 136, 0.4)";
                }
              }}
              onMouseLeave={e => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(255, 106, 136, 0.3)";
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <div style={{ 
              textAlign: "center", 
              marginTop: "15px",
              color: "#666",
              fontSize: '0.95rem'
            }}>
              Don't have an account? <Link to="/signup" style={{ 
                color: "#FF6A88", 
                fontWeight: "600",
                textDecoration: "none"
              }}>Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;