import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  Email as EmailIcon,
  Lock as LockIcon,

  Google,
  Facebook,
  ArrowRightAlt,
  ErrorOutline
} from "@mui/icons-material";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,

  CircularProgress
} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  type UserRole = 'admin' | 'donor' | 'patient';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const role = userSnap.data().role as UserRole;
        const dashboardPath: Record<UserRole, string> = {
          admin: "/admin-dashboard",
          donor: "/donor-dashboard",
          patient: "/patient-dashboard",
        };

        navigate(dashboardPath[role] || "/");
      } else {
        setError("User not found. Please register.");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      {/* Left Column - Image Section */}
      <Box sx={{
        display: { xs: 'none', lg: 'flex' },
        width: '50%',
        background: 'linear-gradient(69deg, #ff6f61 39%, #d32f2f 100%)',

        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.2), transparent)',
          opacity: 0.5,
        },


        alignItems: 'center',
        justifyContent: 'center',
        p: 8
      }}>
        <Box sx={{
          maxWidth: 500,
          color: 'white',
          textAlign: 'center'
        }}>
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 700, textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)', }}>
            Welcome Back
          </Typography>
          <Typography variant="h6" sx={{ mb: 5, opacity: 0.9, textShadow: '1px 1px 6px rgba(0, 0, 0, 0.2)',  }}>
            Connect with life-saving resources in your community. Manage your donations,
            requests, and matches seamlessly.
          </Typography>

        </Box>
      </Box>

      {/* Right Column - Login Form */}
      <Box sx={{
        width: { xs: '100%', lg: '50%' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4
      }}>
        <Box sx={{
          width: '100%',
          maxWidth: 500,
          bgcolor: 'background.paper',
          borderRadius: 4,
          boxShadow: 3,
          p: 6
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              BloodConnect
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your account
            </Typography>
          </Box>

          {error && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'error.light',
              color: 'error.main',
              p: 2,
              borderRadius: 1,
              mb: 3
            }}>
              <ErrorOutline sx={{ mr: 1 }} />
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Email Address"
              placeholder="name@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <EmailIcon sx={{ color: 'action.active', mr: 1 }} />
                )
              }}
              sx={{ mb: 3 }}
              required
            />

            <TextField
              fullWidth
              label="Password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <LockIcon sx={{ color: 'action.active', mr: 1 }} />
                )
              }}
              sx={{ mb: 3 }}
              required
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <>
                  Sign In <ArrowRightAlt sx={{ ml: 1 }} />
                </>
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Button
                  onClick={() => navigate("/register")}
                  sx={{
                    textTransform: 'none',
                    p: 0,
                    minWidth: 'auto',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'transparent',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Create account
                </Button>
              </Typography>
            </Box>

            <Divider sx={{ my: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Or continue with
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Facebook />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Facebook
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;