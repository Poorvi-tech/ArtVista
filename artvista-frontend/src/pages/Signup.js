import React, { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    // Validate password length
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await register(name, email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to create account. Please try again.');
    }
    
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Google sign-up failed. Please try again.');
    }
    
    setLoading(false);
  };

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
            Join ArtVista
          </h2>
          <p style={{
            fontSize: '1.2rem',
            lineHeight: '1.6',
            maxWidth: '400px',
            opacity: 0.9
          }}>
            Unlock exclusive art experiences, personalized recommendations, and interactive features. Create your free account today.
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
        
        {/* Right side - Signup form */}
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
              Create Your Account
            </h1>
            <p style={{ 
              color: "#666",
              fontSize: '1rem'
            }}>
              Join our creative community today
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
          
          {/* Google Sign Up Button */}
          <button 
            onClick={handleGoogleSignUp}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              background: 'white',
              color: '#5F6368',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '20px',
              transition: 'all 0.3s',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
            onMouseEnter={e => e.target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)"}
            onMouseLeave={e => e.target.style.boxShadow = "0 2px 5px rgba(0,0,0,0.05)"}
          >
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '20px',
              height: '20px',
              borderRadius: '3px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              color: '#5F6368',
              marginRight: '8px'
            }}>
              G
            </span>
            Sign up with Google
          </button>
          
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
            onSubmit={handleSignup} 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
          >
            <div>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
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
                placeholder="Password (6+ characters)" 
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
            
            <div>
              <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            
            <div style={{ 
              textAlign: "center", 
              marginTop: "15px",
              color: "#666",
              fontSize: '0.95rem'
            }}>
              Already have an account? <Link to="/login" style={{ 
                color: "#FF6A88", 
                fontWeight: "600",
                textDecoration: "none"
              }}>Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;