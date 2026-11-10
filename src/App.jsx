import React, { useState, useEffect, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000/api';

const PROVIDER_MODELS = {
  Gemini: ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'],
  Groq: ['qwen/qwen3.8-27b', 'openai/gpt-oss-20b', 'openai/gpt-oss-120b']
};

// Inline SVG Icons
const Icons = {
  Mail: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>
    </svg>
  ),
  Lock: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Eye: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeOff: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  Google: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.12 1 1.16 5.92 1.16 12s4.96 11 11.08 11c6.39 0 10.646-4.411 10.646-10.711 0-.727-.08-1.282-.177-1.833h-10.47z"/>
    </svg>
  ),
  Github: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Database: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
    </svg>
  ),
  Broadcast: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17a8.5 8.5 0 0 1 0-10"/><path d="M19 17a8.5 8.5 0 0 0 0-10"/><path d="M9 14a4.5 4.5 0 0 1 0-4"/><path d="M15 14a4.5 4.5 0 0 0 0-4"/><circle cx="12" cy="12" r="1"/>
    </svg>
  ),
  Share: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  Logo: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="brand-logo-mark">
      <rect x="2" y="2" width="20" height="20" rx="6" fill="#18181b" />
      <line x1="6.5" y1="10" x2="6.5" y2="14" stroke="#d6d3d1" strokeWidth="2" strokeLinecap="round" />
      <line x1="10.5" y1="7" x2="10.5" y2="17" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="14.5" y1="9" x2="14.5" y2="15" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <line x1="18.5" y1="11" x2="18.5" y2="13" stroke="#a8a29e" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  EngineBadgeIcon: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
    </svg>
  ),
  PromptIcon: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
  Spark: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="brand-logo-mark">
      <rect x="2" y="2" width="20" height="20" rx="6" fill="#18181b" />
      <line x1="6.5" y1="10" x2="6.5" y2="14" stroke="#d6d3d1" strokeWidth="2" strokeLinecap="round" />
      <line x1="10.5" y1="7" x2="10.5" y2="17" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="14.5" y1="9" x2="14.5" y2="15" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <line x1="18.5" y1="11" x2="18.5" y2="13" stroke="#a8a29e" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Paperclip: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
    </svg>
  ),
  Mic: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  Send: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  Shield: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Spinner: () => (
    <svg className="spinner-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  )
};

export default function App() {
  // Auth State
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [displayName, setDisplayName] = useState(localStorage.getItem('displayName') || '');
  const [authMode, setAuthMode] = useState('LANDING'); // LANDING, LOGIN, REGISTER, FORGOT_PASSWORD, RESET_PASSWORD
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  
  // Register State
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPass, setRegisterPass] = useState('');
  const [registerConfirmPass, setRegisterConfirmPass] = useState('');
  const [registerOtp, setRegisterOtp] = useState('');

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');

  // Reset Password State
  const [resetOtp, setResetOtp] = useState('');
  const [resetNewPass, setResetNewPass] = useState('');
  const [resetConfirmPass, setResetConfirmPass] = useState('');

  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccessMessage, setAuthSuccessMessage] = useState('');
  const [authInfoMessage, setAuthInfoMessage] = useState('');

  // UI Modes
  const [provider, setProvider] = useState('Groq');
  const [model, setModel] = useState('qwen/qwen3.8-27b');
  const [apiKey, setApiKey] = useState('');
  const [analysisMode, setAnalysisMode] = useState('Predictive');

  // Dataset State
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId') || '');
  const [dataset, setDataset] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [showSheetModal, setShowSheetModal] = useState(false);
  const [sheetsList, setSheetsList] = useState([]);
  const [cachedFile, setCachedFile] = useState(null);

  // Chat State
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [expandedCodeIndex, setExpandedCodeIndex] = useState(null);
  
  const [isSystemReady, setIsSystemReady] = useState(false);
  
  // Toast Notification State
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  const showToast = (message, type = 'info') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3500);
  };

  // Share Modal State
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Attachment File Input Ref
  const attachmentInputRef = useRef(null);

  // Voice Input (Speech Recognition) State & Ref
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  
  const chatEndRef = useRef(null);

  // Polling check to wake up backend and AI service on app load
  useEffect(() => {
    let active = true;
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_BASE}/health`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'ok') {
            if (active) {
              setIsSystemReady(true);
            }
            return;
          }
        }
      } catch (err) {
        console.log("Waking up services...");
      }
      
      // Retry in 4 seconds if not ready
      if (active) {
        setTimeout(checkHealth, 4000);
      }
    };

    checkHealth();

    return () => {
      active = false;
    };
  }, []);

  // Sync token and session
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('displayName', displayName);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('displayName');
    }
  }, [token, username, displayName]);

  // Google Sign-In SDK Button rendering (Stays active only in production mode when client ID is provided)
  useEffect(() => {
    if (token || authMode !== 'LOGIN') return;

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (window.google && googleClientId) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response) => {
            handleGoogleLogin(response.credential);
          }
        });

        setTimeout(() => {
          const btnElem = document.getElementById("google-signin-btn");
          if (btnElem) {
            window.google.accounts.id.renderButton(btnElem, {
              theme: "outline",
              size: "large",
              width: 360
            });
          }
        }, 150);
      } catch (err) {
        console.error('Google ID initialize error:', err);
      }
    }
  }, [token, authMode]);

  // Strict Google Login Handler
  const handleGoogleLogin = async (credential) => {
    setAuthError('');
    setAuthSuccessMessage('');
    setAuthInfoMessage('');
    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setUsername(data.username);
        setDisplayName(data.displayName || data.username);
        setAuthSuccessMessage('Successfully logged in with Google!');
      } else {
        setAuthError(data.error || 'Google login failed');
      }
    } catch (err) {
      setAuthError('Connection failed to backend authentication service.');
    }
  };

  // Standard Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMessage('');
    setAuthInfoMessage('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginEmail, password: loginPass })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setUsername(data.username);
        setDisplayName(data.displayName || data.username);
      } else {
        setAuthError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setAuthError('Connection failed. Verify server status.');
    }
  };

  // Registration Request Handler - sends verification OTP
  const handleRegisterRequest = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMessage('');
    setAuthInfoMessage('');

    if (registerPass !== registerConfirmPass) {
      setAuthError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/register-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registerEmail, password: registerPass })
      });
      const data = await res.json();
      if (res.ok) {
        setAuthSuccessMessage(data.message);
        setAuthMode('REGISTER_OTP');
      } else {
        setAuthError(data.error || 'Registration request failed');
      }
    } catch (err) {
      setAuthError('Connection failed. Verify server status.');
    }
  };

  // Registration Verification Handler - verifies OTP and creates user
  const handleRegisterVerify = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMessage('');
    setAuthInfoMessage('');

    try {
      const res = await fetch(`${API_BASE}/auth/register-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registerEmail, otp: registerOtp })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setUsername(data.username);
        setDisplayName(data.username);
        setAuthSuccessMessage('Email verified and account created successfully!');
      } else {
        setAuthError(data.error || 'Verification failed');
      }
    } catch (err) {
      setAuthError('Connection failed. Verify server status.');
    }
  };

  // Forgot Password Request Handler - generates reset OTP
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMessage('');
    setAuthInfoMessage('');
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setAuthSuccessMessage(data.message);
        setAuthMode('RESET_PASSWORD');
      } else {
        setAuthError(data.error || 'Forgot password request failed');
      }
    } catch (err) {
      setAuthError('Connection failed. Verify server status.');
    }
  };

  // Reset Password Execution Handler - verifies reset OTP and updates password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMessage('');
    setAuthInfoMessage('');

    if (resetNewPass !== resetConfirmPass) {
      setAuthError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otp: resetOtp, password: resetNewPass })
      });
      const data = await res.json();
      if (res.ok) {
        setAuthSuccessMessage(data.message + ' Redirecting to login...');
        setTimeout(() => {
          setAuthMode('LOGIN');
          setAuthSuccessMessage('');
          // Clear inputs
          setResetOtp('');
          setResetNewPass('');
          setResetConfirmPass('');
          setForgotEmail('');
        }, 3000);
      } else {
        setAuthError(data.error || 'Password reset failed');
      }
    } catch (err) {
      setAuthError('Connection failed. Verify server status.');
    }
  };

  // Fetch active sessions for the user
  const fetchSessions = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/data/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (e) {
      console.error('Failed to fetch sessions:', e);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSessions();
    } else {
      setSessions([]);
    }
  }, [token]);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('sessionId', sessionId);
      fetchChatHistory();
    } else {
      localStorage.removeItem('sessionId');
    }
  }, [sessionId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = () => {
    setToken('');
    setUsername('');
    setDisplayName('');
    setSessionId('');
    setDataset(null);
    setMessages([]);
    setSessions([]);
    setShowProfileModal(false);
    localStorage.clear();
  };

  const handleNewChat = () => {
    setSessionId('');
    setDataset(null);
    setMessages([]);
    localStorage.removeItem('sessionId');
  };

  const handleSelectSession = (session) => {
    setSessionId(session.sessionId);
    setDataset({
      filename: session.filename,
      rows: session.rows,
      columns: session.columns
    });
  };

  // Chat History fetcher
  const fetchChatHistory = async () => {
    if (!token || !sessionId) return;
    try {
      const res = await fetch(`${API_BASE}/data/history/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setMessages(data);
      }
    } catch (e) {
      console.error('History fetch failed:', e);
    }
  };

  // File Upload Handlers
  const uploadFileToServer = async (file, sheetName = null) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    if (sheetName) formData.append('sheet_name', sheetName);
    if (sessionId) formData.append('session_id', sessionId);

    try {
      const res = await fetch(`${API_BASE}/data/load`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        alert('Session expired. Please log in again.');
        return;
      }
      const data = await res.json();
      if (res.ok) {
        if (data.requires_sheet_selection) {
          setSheetsList(data.sheets);
          setCachedFile(file);
          setSessionId(data.session_id);
          setShowSheetModal(true);
        } else {
          setDataset(data);
          setSessionId(data.session_id);
          setShowSheetModal(false);
          setCachedFile(null);
          fetchSessions();
        }
      } else {
        alert(data.error || 'Failed to parse dataset.');
      }
    } catch (err) {
      alert('Network upload failure.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFileToServer(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadFileToServer(e.target.files[0]);
    }
  };

  // Attachment Paperclip Click Handler
  const handleAttachmentClick = () => {
    if (attachmentInputRef.current) {
      attachmentInputRef.current.click();
    }
  };

  const handleAttachmentFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      uploadFileToServer(file);
      showToast(`📁 Uploading dataset: ${file.name}`, 'info');
      e.target.value = '';
    }
  };

  // Voice Speech-to-Text Recognition Toggle
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast("⚠️ Voice recognition is not supported in this browser. Try Google Chrome or Microsoft Edge.", "warning");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (err) {}
      }
      setIsListening(false);
      showToast("🎙️ Voice input stopped.", "info");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        showToast("🎙️ Listening... Speak your prompt now", "info");
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setPrompt(prev => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          showToast("⚠️ Microphone access denied. Please allow mic permissions.", "error");
        } else if (event.error !== 'no-speech') {
          showToast(`⚠️ Voice error: ${event.error}`, "warning");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
      showToast("⚠️ Unable to start voice recognition.", "error");
    }
  };

  // Share Actions
  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?session=${sessionId || 'live'}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShareCopied(true);
      showToast("✅ Share link copied to clipboard!", "success");
      setTimeout(() => setShareCopied(false), 2500);
    }).catch(() => {
      showToast("⚠️ Failed to copy link to clipboard", "error");
    });
  };

  const handleExportChatJSON = () => {
    if (!messages || messages.length === 0) {
      showToast("⚠️ No chat history available to export.", "warning");
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(messages, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `datawhisperer_chat_${sessionId || 'export'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("📥 Exported chat session to JSON!", "success");
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'DataWhisperer Analysis',
        text: dataset ? `Check out my dataset analysis for ${dataset.filename} on DataWhisperer!` : 'Check out DataWhisperer AI Data Analytics!',
        url: window.location.href,
      }).catch(console.error);
    } else {
      handleCopyShareLink();
    }
  };

  // Query Submit Handler
  const handleQuery = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || !sessionId || loading) return;

    const userMessage = prompt;
    setPrompt('');
    setLoading(true);

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const res = await fetch(`${API_BASE}/data/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          session_id: sessionId,
          question: userMessage,
          provider,
          model_name: model,
          api_key: apiKey
        })
      });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        alert('Session expired. Please log in again.');
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.answer,
          code: data.code,
          chart: data.chart,
          captured_df: data.captured_df
        }]);
        fetchSessions();
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `⚠️ Execution Error: ${data.error}`
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '🌐 Connection Timeout: Backend server is unreachable.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Client Side CSV Exporter
  const downloadCSV = (records, filename = 'query_result.csv') => {
    if (!records || records.length === 0) return;
    const headers = Object.keys(records[0]);
    const csvRows = [
      headers.join(','),
      ...records.map(row => 
        headers.map(fieldName => {
          const val = row[fieldName] ?? '';
          return JSON.stringify(val.toString());
        }).join(',')
      )
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Custom Table Cell styler for visual mockup layout
  const renderCell = (col, val) => {
    if (val === null || val === undefined) return '';
    const str = val.toString();
    if (col.toLowerCase().includes('growth') || str.startsWith('+') || (str.includes('%') && !str.includes(' '))) {
      return <span className="table-growth-pill">{str}</span>;
    }
    return str;
  };

  // Smooth scroll handler for landing page navigation
  const scrollToSection = (id) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Render Landing Page / Auth Screens if not authenticated
  if (!token) {
    if (authMode === 'LANDING') {
      return (
        <div className="landing-page">
          {/* Navbar */}
          <header className="landing-navbar">
            <div className="landing-brand" onClick={() => scrollToSection('home')}>
              <Icons.Logo /> DataWhisperer
            </div>
            <nav className="landing-nav-links">
              <span className="landing-nav-link" onClick={() => scrollToSection('home')}>Home</span>
              <span className="landing-nav-link" onClick={() => scrollToSection('features')}>Features</span>
              <span className="landing-nav-link" onClick={() => scrollToSection('about')}>About Us</span>
              <span className="landing-nav-link" onClick={() => scrollToSection('developer')}>Developer</span>
              <span className="landing-nav-link" onClick={() => scrollToSection('contact')}>Contact</span>
            </nav>
            <div className="landing-nav-actions">
              <button 
                className="btn-nav-outline"
                onClick={() => { setAuthMode('LOGIN'); setAuthError(''); setAuthSuccessMessage(''); }}
              >
                Log In
              </button>
              <button 
                className="btn-nav-primary"
                onClick={() => { setAuthMode('REGISTER'); setAuthError(''); setAuthSuccessMessage(''); }}
              >
                Register Free
              </button>
            </div>
          </header>

          {/* Hero Section */}
          <section id="home" className="landing-hero">
            <div>
              <div className="hero-pill-badge">
                <Icons.EngineBadgeIcon /> Conversational Data Analytics Engine
              </div>
              <h1 className="hero-title">
                Transform Raw Data into <span className="gradient-span">Conversational Intelligence</span>
              </h1>
              <p className="hero-subtitle">
                Upload CSV, Excel, or JSON datasets and ask complex analytical questions in plain English. Powered by isolated Python sandbox execution and high-speed Groq & Gemini LLM orchestrations.
              </p>
              <div className="hero-cta-group">
                <button 
                  className="btn-gradient" 
                  style={{ width: 'auto', padding: '0.85rem 2rem' }}
                  onClick={() => { setAuthMode('REGISTER'); setAuthError(''); setAuthSuccessMessage(''); }}
                >
                  Get Started Free <span>→</span>
                </button>
                <button 
                  className="btn-nav-outline" 
                  style={{ borderRadius: '12px', padding: '0.85rem 1.75rem', fontSize: '0.9rem' }}
                  onClick={() => { setAuthMode('LOGIN'); setAuthError(''); setAuthSuccessMessage(''); }}
                >
                  Sign In to Dashboard
                </button>
              </div>
              <div className="hero-metrics-row">
                <div className="hero-metric-item">
                  <h4>100%</h4>
                  <p>Secure Sandbox</p>
                </div>
                <div className="hero-metric-item">
                  <h4>&lt; 2s</h4>
                  <p>Fast LLM Response</p>
                </div>
                <div className="hero-metric-item">
                  <h4>Multi-LLM</h4>
                  <p>Groq, Gemini & OpenAI</p>
                </div>
              </div>
            </div>

            {/* Visual Interactive Mockup Card */}
            <div className="hero-mockup-card">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span className="mockup-dot red"></span>
                  <span className="mockup-dot yellow"></span>
                  <span className="mockup-dot green"></span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>LIVE DEMO MOCKUP</span>
              </div>
              <div className="mockup-prompt-box">
                <Icons.PromptIcon /> "Show sales comparison by region and plot a bar chart"
              </div>
              <div className="mockup-chart-container">
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>📈 Regional Revenue Distribution</span>
                  <span style={{ color: 'var(--color-primary)' }}>Pandas Executed ✓</span>
                </div>
                <div className="mockup-bars">
                  <div className="mockup-bar" style={{ height: '40%' }}></div>
                  <div className="mockup-bar" style={{ height: '75%' }}></div>
                  <div className="mockup-bar" style={{ height: '60%' }}></div>
                  <div className="mockup-bar" style={{ height: '95%' }}></div>
                  <div className="mockup-bar" style={{ height: '50%' }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="landing-section">
            <div className="section-header">
              <h2 className="section-title">Engineered for High-Speed Analysis</h2>
              <p className="section-subtitle">DataWhisperer combines automated Python AST execution with cutting-edge LLMs to deliver accurate data insights without writing code.</p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon-wrapper">💬</div>
                <h3>Natural Language Queries</h3>
                <p>Ask questions in natural human language. The AI agent generates and runs exact Pandas code against your pre-loaded dataset.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">📊</div>
                <h3>Instant Visualizations</h3>
                <p>Automatically renders clean Matplotlib bar graphs, pie charts, line trends, and distribution histograms upon prompt request.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">🛡️</div>
                <h3>Secure AST Sandbox</h3>
                <p>Executes code in an isolated local sandbox with AST static analysis, protecting against unauthorized file system or network access.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">⚡</div>
                <h3>High-Speed Groq Engine</h3>
                <p>Powered by Groq LPU speed acceleration and Qwen 27B / GPT-OSS models for sub-second analytical generation.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">📥</div>
                <h3>CSV Data Export</h3>
                <p>Filter, slice, and group your dataset dynamically and download extracted CSV files directly from the chat interface.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">📂</div>
                <h3>Multi-Format Support</h3>
                <p>Supports CSV, Excel (`.xlsx`, `.xls` with sheet selection), and JSON tabular dataset uploads seamlessly.</p>
              </div>
            </div>
          </section>

          {/* About Us Section */}
          <section id="about" className="landing-section">
            <div className="section-header">
              <h2 className="section-title">About DataWhisperer</h2>
              <p className="section-subtitle">Empowering non-technical domain experts to interact with complex datasets securely and effortlessly.</p>
            </div>
            
            <div className="about-split-container">
              {/* Left Column: Narrative & Verification Pillars */}
              <div className="about-narrative-card">
                <div className="about-enterprise-badge">
                  <Icons.Shield /> Enterprise AST Architecture
                </div>
                <p className="about-narrative-text">
                  Traditional data analytics requires deep proficiency in Python, SQL, or specialized BI software. DataWhisperer bridges this gap by integrating state-of-the-art Large Language Models with a deterministic Python AST code execution environment.
                </p>
                <p className="about-narrative-text" style={{ margin: 0 }}>
                  By isolating Python executions within a sandboxed environment, DataWhisperer ensures zero hallucinations in metric calculations, precise chart generations, and complete security for conversational data discovery.
                </p>
                <div className="about-pillars-grid">
                  <div className="about-pillar-item">
                    <span className="pillar-check">✓</span>
                    <span>Zero Metric Hallucinations</span>
                  </div>
                  <div className="about-pillar-item">
                    <span className="pillar-check">✓</span>
                    <span>Deterministic AST Sandbox</span>
                  </div>
                  <div className="about-pillar-item">
                    <span className="pillar-check">✓</span>
                    <span>Sub-second Execution Flow</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Processing Pipeline Widget */}
              <div className="about-pipeline-card">
                <div className="pipeline-header">
                  <div className="pipeline-title-group">
                    <span className="pipeline-indicator-dot"></span>
                    <h4>Execution Architecture</h4>
                  </div>
                  <span className="pipeline-tag">Deterministic Engine</span>
                </div>

                <div className="pipeline-flow">
                  {/* Step 1 */}
                  <div className="pipeline-node">
                    <div className="node-number">01</div>
                    <div className="node-details">
                      <div className="node-label">Natural Language Query</div>
                      <div className="node-sub">"Compare regional revenue by product & plot bar chart"</div>
                    </div>
                  </div>

                  {/* Flow Connector */}
                  <div className="pipeline-connector">
                    <div className="connector-stem"></div>
                    <div className="connector-arrow">↓</div>
                  </div>

                  {/* Step 2 */}
                  <div className="pipeline-node node-active">
                    <div className="node-number active">02</div>
                    <div className="node-details">
                      <div className="node-label">Isolated Python AST Sandbox</div>
                      <div className="node-sub">Static AST code validation • Native Pandas execution</div>
                    </div>
                  </div>

                  {/* Flow Connector */}
                  <div className="pipeline-connector">
                    <div className="connector-stem"></div>
                    <div className="connector-arrow">↓</div>
                  </div>

                  {/* Step 3 */}
                  <div className="pipeline-node">
                    <div className="node-number">03</div>
                    <div className="node-details">
                      <div className="node-label">Verified Insights & Charts</div>
                      <div className="node-sub">100% verified accuracy • Real-time Matplotlib plots & CSV</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Developer Spotlight Section */}
          <section id="developer" className="landing-section" style={{ paddingTop: '2rem' }}>
            <div className="section-header">
              <h2 className="section-title">Developer Spotlight</h2>
              <p className="section-subtitle">Architected and developed with high-performance full-stack AI technologies.</p>
            </div>

            <div className="developer-card">
              <div className="developer-avatar-wrapper">
                <div className="developer-avatar-large">SK</div>
                <div className="developer-title-badge">Lead Developer</div>
              </div>
              <div className="developer-info">
                <h3>Sidharth Kumar</h3>
                <p className="developer-role">AI Full Stack Developer</p>
                <p className="developer-bio">
                  Specialized in building end-to-end intelligent AI web applications, conversational data intelligence frameworks, LLM orchestrations, and secure sandbox execution engines.
                </p>
                <div className="developer-contact-buttons">
                  <a 
                    href="https://www.linkedin.com/in/sidharth-kumar-12537b321/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-social linkedin"
                  >
                    <Icons.Github /> LinkedIn Profile
                  </a>
                  <a 
                    href="mailto:sidharthkumar7177@gmail.com" 
                    className="btn-social"
                  >
                    <Icons.Mail /> Email Developer
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Section */}
          <footer id="contact" className="landing-footer">
            <div className="footer-content">
              <div className="landing-brand" onClick={() => scrollToSection('home')}>
                <Icons.Logo /> DataWhisperer
              </div>
              <div className="landing-nav-links">
                <span className="landing-nav-link" onClick={() => scrollToSection('home')}>Home</span>
                <span className="landing-nav-link" onClick={() => scrollToSection('features')}>Features</span>
                <span className="landing-nav-link" onClick={() => scrollToSection('about')}>About Us</span>
                <span className="landing-nav-link" onClick={() => scrollToSection('developer')}>Developer</span>
                <span 
                  className="landing-nav-link" 
                  onClick={() => setAuthMode('LOGIN')}
                >
                  Log In
                </span>
                <span 
                  className="landing-nav-link" 
                  onClick={() => setAuthMode('REGISTER')}
                  style={{ color: 'var(--color-primary)' }}
                >
                  Register
                </span>
              </div>
            </div>
            <div className="footer-copyright">
              © {new Date().getFullYear()} DataWhisperer AI. Created by <strong>Sidharth Kumar</strong> (AI Full Stack Developer). All rights reserved.
            </div>
          </footer>
        </div>
      );
    }

    return (
      <div className="auth-container">
        <div style={{ position: 'absolute', top: '1.5rem', left: '2rem' }}>
          <button 
            className="btn-nav-outline" 
            onClick={() => setAuthMode('LANDING')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            ← Back to Home
          </button>
        </div>

        {authMode === 'LOGIN' && (
          <form className="auth-card" onSubmit={handleLogin}>
            <div className="auth-header">
              <h1 className="auth-logo" onClick={() => setAuthMode('LANDING')} style={{ cursor: 'pointer' }}>DataWhisperer</h1>
              <p className="auth-subtitle">Unlock insights with conversational intelligence</p>
            </div>
            <h2>Welcome back</h2>
            
            {authError && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>{authError}</div>}
            {authSuccessMessage && <div style={{ color: '#10b981', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>{authSuccessMessage}</div>}
            {authInfoMessage && <div style={{ color: '#3b82f6', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>{authInfoMessage}</div>}

            <div className="form-group">
              <label>Work Email</label>
              <div className="input-wrapper">
                <span className="input-icon-left"><Icons.Mail /></span>
                <input 
                  type="text" 
                  className="form-input" 
                  value={loginEmail} 
                  onChange={e => setLoginEmail(e.target.value)} 
                  placeholder="name@company.com"
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ margin: 0 }}>Password</label>
                <a 
                  href="#forgot" 
                  style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textDecoration: 'none' }}
                  onClick={(e) => { e.preventDefault(); setAuthMode('FORGOT_PASSWORD'); setAuthError(''); setAuthSuccessMessage(''); setAuthInfoMessage(''); }}
                >
                  Forgot?
                </a>
              </div>
              <div className="input-wrapper">
                <span className="input-icon-left"><Icons.Lock /></span>
                <input 
                  type={showPass ? 'text' : 'password'} 
                  className="form-input" 
                  value={loginPass} 
                  onChange={e => setLoginPass(e.target.value)} 
                  placeholder="••••••••"
                  required 
                />
                <span className="input-icon-right" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <Icons.EyeOff /> : <Icons.Eye />}
                </span>
              </div>
            </div>
            
            <button type="submit" className="btn-gradient">
              Sign In to Dashboard <span>→</span>
            </button>
            
            <div className="oauth-divider">Or continue with</div>
            
            {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <div id="google-signin-btn"></div>
              </div>
            ) : (
              <div className="oauth-grid">
                <button type="button" className="btn-oauth" style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed', marginBottom: '1.25rem' }} disabled title="Google Sign-In requires configuring VITE_GOOGLE_CLIENT_ID in .env">
                  <Icons.Google /> Google (Unconfigured)
                </button>
              </div>
            )}
            
            <div className="auth-footer-links">
              New to the platform?{' '}
              <a 
                href="#create"
                onClick={(e) => { e.preventDefault(); setAuthMode('REGISTER'); setAuthError(''); setAuthSuccessMessage(''); setAuthInfoMessage(''); }}
              >
                Create an account
              </a>
            </div>
          </form>
        )}

        {authMode === 'REGISTER' && (
          <form className="auth-card" onSubmit={handleRegisterRequest}>
            <div className="auth-header">
              <h1 className="auth-logo">DataWhisperer</h1>
              <p className="auth-subtitle">Unlock insights with conversational intelligence</p>
            </div>
            <h2>Create Account</h2>
            
            {authError && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>{authError}</div>}
            {authSuccessMessage && <div style={{ color: '#10b981', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>{authSuccessMessage}</div>}

            <div className="form-group">
              <label>Work Email</label>
              <div className="input-wrapper">
                <span className="input-icon-left"><Icons.Mail /></span>
                <input 
                  type="email" 
                  className="form-input" 
                  value={registerEmail} 
                  onChange={e => setRegisterEmail(e.target.value)} 
                  placeholder="name@company.com"
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <span className="input-icon-left"><Icons.Lock /></span>
                <input 
                  type={showPass ? 'text' : 'password'} 
                  className="form-input" 
                  value={registerPass} 
                  onChange={e => setRegisterPass(e.target.value)} 
                  placeholder="••••••••"
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon-left"><Icons.Lock /></span>
                <input 
                  type={showPass ? 'text' : 'password'} 
                  className="form-input" 
                  value={registerConfirmPass} 
                  onChange={e => setRegisterConfirmPass(e.target.value)} 
                  placeholder="••••••••"
                  required 
                />
              </div>
            </div>
            
            <button type="submit" className="btn-gradient">
              Send Verification Code <span>→</span>
            </button>
            
            <div className="oauth-divider">Or continue with</div>
            
            {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <div id="google-signin-btn"></div>
              </div>
            ) : (
              <div className="oauth-grid">
                <button type="button" className="btn-oauth" style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed', marginBottom: '1.25rem' }} disabled title="Google Sign-In requires configuring VITE_GOOGLE_CLIENT_ID in .env">
                  <Icons.Google /> Google (Unconfigured)
                </button>
              </div>
            )}
            
            <div className="auth-footer-links">
              Already have an account?{' '}
              <a 
                href="#login"
                onClick={(e) => { e.preventDefault(); setAuthMode('LOGIN'); setAuthError(''); setAuthSuccessMessage(''); setAuthInfoMessage(''); }}
              >
                Sign In
              </a>
            </div>
          </form>
        )}

        {authMode === 'REGISTER_OTP' && (
          <form className="auth-card" onSubmit={handleRegisterVerify}>
            <div className="auth-header">
              <h1 className="auth-logo">DataWhisperer</h1>
              <p className="auth-subtitle">Unlock insights with conversational intelligence</p>
            </div>
            <h2>Verify Your Email</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.5rem', lineHeight: '1.4' }}>
              We've sent a 6-digit One-Time Password (OTP) to <strong>{registerEmail}</strong>. Enter it below to complete registration.
            </p>
            
            {authError && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>{authError}</div>}
            {authSuccessMessage && <div style={{ color: '#10b981', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>{authSuccessMessage}</div>}
            {authInfoMessage && <div style={{ color: '#3b82f6', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center', lineHeight: '1.3' }}>{authInfoMessage}</div>}

            <div className="form-group">
              <label>6-Digit Verification Code</label>
              <div className="input-wrapper">
                <span className="input-icon-left"><Icons.Lock /></span>
                <input 
                  type="text" 
                  className="form-input" 
                  value={registerOtp} 
                  maxLength={6}
                  onChange={e => setRegisterOtp(e.target.value)} 
                  placeholder="e.g. 123456"
                  required 
                />
              </div>
            </div>
            
            <button type="submit" className="btn-gradient">
              Verify & Complete Sign Up <span>→</span>
            </button>
            
            <div className="auth-footer-links">
              Didn't receive code?{' '}
              <a 
                href="#resend"
                onClick={(e) => { e.preventDefault(); handleRegisterRequest(e); }}
              >
                Resend code
              </a>
              <br />
              <a 
                href="#back"
                style={{ marginTop: '0.5rem', display: 'inline-block' }}
                onClick={(e) => { e.preventDefault(); setAuthMode('REGISTER'); setAuthError(''); setAuthSuccessMessage(''); setAuthInfoMessage(''); setDemoLoggedOtp(''); }}
              >
                Back to Sign Up
              </a>
            </div>
          </form>
        )}

        {authMode === 'FORGOT_PASSWORD' && (
          <form className="auth-card" onSubmit={handleForgotPassword}>
            <div className="auth-header">
              <h1 className="auth-logo">DataWhisperer</h1>
              <p className="auth-subtitle">Unlock insights with conversational intelligence</p>
            </div>
            <h2>Reset Password</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.5rem', lineHeight: '1.4' }}>
              Enter your work email address and we'll send you an OTP to reset your password.
            </p>
            
            {authError && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>{authError}</div>}
            {authSuccessMessage && <div style={{ color: '#10b981', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>{authSuccessMessage}</div>}

            <div className="form-group">
              <label>Work Email</label>
              <div className="input-wrapper">
                <span className="input-icon-left"><Icons.Mail /></span>
                <input 
                  type="email" 
                  className="form-input" 
                  value={forgotEmail} 
                  onChange={e => setForgotEmail(e.target.value)} 
                  placeholder="name@company.com"
                  required 
                />
              </div>
            </div>
            
            <button type="submit" className="btn-gradient">
              Send Reset Code <span>→</span>
            </button>
            
            <div className="auth-footer-links">
              <a 
                href="#login"
                onClick={(e) => { e.preventDefault(); setAuthMode('LOGIN'); setAuthError(''); setAuthSuccessMessage(''); setAuthInfoMessage(''); }}
              >
                Back to Sign In
              </a>
            </div>
          </form>
        )}

        {authMode === 'RESET_PASSWORD' && (
          <form className="auth-card" onSubmit={handleResetPassword}>
            <div className="auth-header">
              <h1 className="auth-logo">DataWhisperer</h1>
              <p className="auth-subtitle">Unlock insights with conversational intelligence</p>
            </div>
            <h2>New Password</h2>
            
            {authError && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>{authError}</div>}
            {authSuccessMessage && <div style={{ color: '#10b981', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>{authSuccessMessage}</div>}
            {authInfoMessage && (
              <div style={{ 
                color: '#3b82f6', 
                fontSize: '0.8rem', 
                marginBottom: '1.25rem', 
                textAlign: 'center',
                background: 'rgba(59, 130, 246, 0.1)',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                lineHeight: '1.3'
              }}>
                {authInfoMessage}
              </div>
            )}

            <div className="form-group">
              <label>6-Digit Reset OTP</label>
              <div className="input-wrapper">
                <span className="input-icon-left"><Icons.Lock /></span>
                <input 
                  type="text" 
                  className="form-input" 
                  value={resetOtp} 
                  maxLength={6}
                  onChange={e => setResetOtp(e.target.value)} 
                  placeholder="Enter code from email"
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>New Password</label>
              <div className="input-wrapper">
                <span className="input-icon-left"><Icons.Lock /></span>
                <input 
                  type={showPass ? 'text' : 'password'} 
                  className="form-input" 
                  value={resetNewPass} 
                  onChange={e => setResetNewPass(e.target.value)} 
                  placeholder="••••••••"
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="input-wrapper">
                <span className="input-icon-left"><Icons.Lock /></span>
                <input 
                  type={showPass ? 'text' : 'password'} 
                  className="form-input" 
                  value={resetConfirmPass} 
                  onChange={e => setResetConfirmPass(e.target.value)} 
                  placeholder="••••••••"
                  required 
                />
              </div>
            </div>
            
            <button type="submit" className="btn-gradient">
              Update Password <span>→</span>
            </button>
            
            <div className="auth-footer-links">
              <a 
                href="#login"
                onClick={(e) => { e.preventDefault(); setAuthMode('LOGIN'); setAuthError(''); setAuthSuccessMessage(''); setAuthInfoMessage(''); setDemoLoggedOtp(''); }}
              >
                Back to Sign In
              </a>
            </div>
          </form>
        )}

        <div className="auth-bottom-nav">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#security">Security</a>
        </div>
        
        <div className="encryption-tag">
          <Icons.Shield /> Enterprise Grade Encryption
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Sidebar Panel */}
      <aside className="sidebar">
        <h1 className="sidebar-title"><Icons.Logo size={22} /> DataWhisperer</h1>

        <button 
          className="btn-gradient" 
          style={{ width: '100%', marginBottom: '1.25rem', padding: '0.65rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} 
          onClick={handleNewChat}
        >
          <span>➕</span> New Chat
        </button>
        
        {/* Model Configurations */}
        <div className="sidebar-section">
          <div className="sidebar-label">LLM Provider</div>
          <select 
            className="sidebar-select" 
            value={provider} 
            onChange={e => {
              const p = e.target.value;
              setProvider(p);
              setModel(PROVIDER_MODELS[p][0]);
            }}
          >
            <option value="Groq">Groq (Qwen / GPT-OSS)</option>
            <option value="Gemini">Gemini</option>
          </select>
        </div>

        {/* Analysis Mode Toggle */}
        <div className="sidebar-section">
          <div className="sidebar-label">Analysis Mode</div>
          <div className="mode-toggle-group">
            <div 
              className={`btn-mode-toggle ${analysisMode === 'Predictive' ? 'active' : 'inactive'}`}
              onClick={() => setAnalysisMode('Predictive')}
            >
              Predictive
            </div>
            <div 
              className={`btn-mode-toggle ${analysisMode === 'Descriptive' ? 'active' : 'inactive'}`}
              onClick={() => setAnalysisMode('Descriptive')}
            >
              Descriptive
            </div>
          </div>
        </div>

        {/* Recent Chats history list */}
        <div className="sidebar-section">
          <div className="sidebar-label">🕒 Recent Chats</div>
          <div className="chats-list">
            {sessions.length === 0 ? (
              <div className="empty-chats-hint">
                No recent chats. Upload a file to begin!
              </div>
            ) : (
              sessions.map(s => (
                <div 
                  key={s.sessionId}
                  className={`chat-item ${sessionId === s.sessionId ? 'active' : 'inactive'}`} 
                  onClick={() => handleSelectSession(s)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
                    {s.title}
                  </div>
                  <div className="chat-item-time" style={{ fontSize: '0.65rem', marginTop: '0.15rem' }}>
                    {new Date(s.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dataset Status / Uploader */}
        <div className="sidebar-section" style={{ marginTop: 'auto' }}>
          <div className="sidebar-label">Active Dataset</div>
          {!dataset ? (
            !isSystemReady ? (
              <div className="dropzone disabled waking-state">
                <div className="waking-spinner"></div>
                <div className="waking-title">Waking up AI Engine...</div>
                <div className="waking-subtitle">Free servers take ~30s to boot up.</div>
              </div>
            ) : (
              <div 
                className={`dropzone ${isDragActive ? 'active' : ''}`}
                onDragOver={e => { e.preventDefault(); setIsDragActive(true); }}
                onDragLeave={() => setIsDragActive(false)}
                onDrop={handleFileDrop}
                onClick={() => document.getElementById('file-picker').click()}
              >
                <div className="dropzone-icon">📥</div>
                <div className="dropzone-text">Drag or browse dataset</div>
                <input 
                  type="file" 
                  id="file-picker" 
                  style={{ display: 'none' }} 
                  onChange={handleFileSelect} 
                  accept=".csv, .xlsx, .xls, .json"
                />
              </div>
            )
          ) : (
            <div className="active-dataset-card">
              <div className="dataset-icon-wrapper">
                <Icons.Database />
              </div>
              <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {dataset.filename}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>
                  {dataset.rows?.toLocaleString()} rows • {dataset.columns} cols
                </div>
              </div>
              <button 
                className="chat-input-action-btn"
                style={{ width: '28px', height: '28px', padding: 0 }}
                onClick={() => setDataset(null)}
                title="Clear Dataset"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* User Card profile footer */}
        <div className="user-profile-card" onClick={() => setShowProfileModal(true)} style={{ cursor: 'pointer' }} title="View Profile">
          <div className="user-avatar">
            {(displayName || username || 'JD').substring(0, 2).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name" title={username}>{displayName || (username === 'admin' ? 'John Doe' : username)}</span>
            <span className="user-plan">Pro Plan</span>
          </div>
          <button className="settings-cog-btn" onClick={(e) => { e.stopPropagation(); setShowProfileModal(true); }} title="Settings / Profile">
            <Icons.Settings />
          </button>
        </div>
      </aside>

      {/* Main Console */}
      <main className="main-console">
        <header className="console-header">
          <div className="console-title-group">
            <h2 className="console-title">💬 Ask Questions</h2>
            <div className="engine-status-pill">
              <span className="engine-status-dot" /> Live Engine
            </div>
          </div>
          <div className="header-action-group">
            <button className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }} onClick={() => setShowShareModal(true)} title="Share Analysis Session">
              <Icons.Share /> Share
            </button>
            <span style={{ color: 'var(--color-text-subtle)', pointerEvents: 'none' }}><Icons.Broadcast /></span>
          </div>
        </header>

        {/* Chat History Panel */}
        <div className="chat-history">
          {!dataset ? (
            <div className="empty-chat">
              <div className="empty-chat-icon">📊</div>
              <h3>Welcome to DataWhisperer</h3>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Please upload a CSV, Excel, or JSON file in the sidebar to begin.</p>
            </div>
          ) : (
            <>
              {/* Permanent Dataset Preview Table */}
              <div className="dataset-preview-container">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
                  <span style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}><Icons.Database /></span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>Preview: {dataset.filename}</h3>
                </div>
                <div className="preview-table-wrapper">
                  <table className="preview-table">
                    <thead>
                      <tr>
                        {dataset.columns_list?.map(col => (
                          <th key={col}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dataset.preview?.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {dataset.columns_list?.map(col => (
                            <td key={col}>
                              {renderCell(col, row[col])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Chat Conversation History */}
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  💬 Ask a question in the input bar below to begin analyzing this dataset.
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className={`message-row ${msg.role}`}>
                    <div className="message-bubble">
                      {msg.role === 'assistant' && (
                        <div className="assistant-name-tag">
                          <Icons.Logo size={16} /> DataWhisperer AI
                        </div>
                      )}
                      <div>{msg.content}</div>

                      {/* Custom visual Neon Bar Chart Mockup (triggered on EMEA queries) */}
                      {msg.role === 'assistant' && msg.content.includes("EMEA") && (
                        <div className="chart-visual-bars">
                          <div className="chart-bar-node" style={{ height: '32%', animationDelay: '0.05s' }} title="Week 1" />
                          <div className="chart-bar-node" style={{ height: '48%', animationDelay: '0.1s' }} title="Week 2" />
                          <div className="chart-bar-node" style={{ height: '40%', animationDelay: '0.15s' }} title="Week 3" />
                          <div className="chart-bar-node" style={{ height: '64%', animationDelay: '0.2s' }} title="Week 4" />
                          <div className="chart-bar-node" style={{ height: '60%', animationDelay: '0.25s' }} title="Week 5" />
                          <div className="chart-bar-node" style={{ height: '76%', animationDelay: '0.3s' }} title="Week 6" />
                          <div className="chart-bar-node" style={{ height: '94%', animationDelay: '0.35s' }} title="Week 7 (Peak)" />
                        </div>
                      )}
                      
                      {/* Code Inspector */}
                      {msg.code && (
                        <div className="code-expander">
                          <div 
                            className="expander-header" 
                            onClick={() => setExpandedCodeIndex(expandedCodeIndex === index ? null : index)}
                          >
                            <span>🛠️ View Python Implementation</span>
                            <span>{expandedCodeIndex === index ? '▲' : '▼'}</span>
                          </div>
                          {expandedCodeIndex === index && (
                            <pre className="expander-content">{msg.code}</pre>
                          )}
                        </div>
                      )}

                      {/* Visual Chart */}
                      {msg.chart && (
                        <div className="chart-preview">
                          <img src={`data:image/png;base64,${msg.chart}`} alt="AI Generated Chart" />
                        </div>
                      )}

                      {/* Captured DataFrame Downloader */}
                      {msg.captured_df && msg.captured_df.length > 0 && (
                        <div className="download-section">
                          <div className="download-title">📥 Query results extracted ({msg.captured_df.length.toLocaleString()} rows):</div>
                          <div className="download-grid">
                            <button 
                              className="btn-secondary" 
                              onClick={() => downloadCSV(msg.captured_df)}
                            >
                              📄 Download as CSV
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
          {loading && (
            <div className="message-row assistant loading-row">
              <div className="message-bubble loading-bubble">
                <div className="assistant-name-tag">
                  <Icons.Logo size={16} /> DataWhisperer AI
                </div>
                <div className="ai-thinking-container">
                  <span className="ai-thinking-text">Analyzing dataset & generating insights</span>
                  <div className="ai-thinking-dots">
                    <span className="dot dot-1"></span>
                    <span className="dot dot-2"></span>
                    <span className="dot dot-3"></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form Bar */}
        <div className="chat-input-container">
          <form className={`chat-input-wrapper ${loading ? 'is-loading' : ''}`} onSubmit={handleQuery}>
            <button 
              type="button" 
              className="chat-input-action-btn"
              onClick={handleAttachmentClick}
              title="Upload dataset attachment (.csv, .xlsx, .json)"
            >
              <Icons.Paperclip />
            </button>
            <input 
              type="file" 
              ref={attachmentInputRef} 
              style={{ display: 'none' }} 
              accept=".csv, .xlsx, .xls, .json" 
              onChange={handleAttachmentFileSelect} 
            />
            <input 
              type="text" 
              className="chat-input" 
              placeholder={
                loading 
                  ? "⚡ DataWhisperer AI is processing your request..." 
                  : (isListening 
                      ? "🎙️ Listening... Speak your prompt now..." 
                      : (dataset ? "Ask about EMEA trends or dataset specifics..." : "Please upload a dataset first"))
              }
              disabled={!dataset || loading}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
            />
            <button 
              type="button" 
              className={`chat-input-action-btn ${isListening ? 'listening-active' : ''}`}
              onClick={toggleVoiceInput}
              title={isListening ? "Stop Voice Listening" : "Dictate query with Voice"}
            >
              <Icons.Mic />
            </button>
            <button 
              type="submit" 
              className="chat-submit-circle-btn" 
              disabled={!dataset || loading || (!prompt.trim() && !loading)}
            >
              {loading ? <Icons.Spinner /> : <Icons.Send />}
            </button>
          </form>
        </div>

        {/* Sheet Selector Modal Overlay */}
        {showSheetModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3 className="modal-title">📄 Select Sheet from Excel File</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                This workbook contains multiple sheets. Choose which one to read:
              </p>
              <div className="sheet-list">
                {sheetsList.map(sheet => (
                  <div 
                    key={sheet} 
                    className="sheet-item"
                    onClick={() => {
                      setShowSheetModal(false);
                      uploadFileToServer(cachedFile, sheet);
                    }}
                  >
                    {sheet}
                  </div>
                ))}
              </div>
              <button 
                className="btn-secondary" 
                style={{ width: '100%' }} 
                onClick={() => {
                  setShowSheetModal(false);
                  setCachedFile(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Profile Modal Overlay */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', width: '100%' }}>
              <h3 className="modal-title" style={{ margin: 0 }}>👤 User Profile</h3>
              <button 
                onClick={() => setShowProfileModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '1.2rem', cursor: 'pointer', padding: 0 }}
                title="Close Profile"
              >
                ✕
              </button>
            </div>

            <div style={{ margin: '1.5rem 0' }}>
              <div className="user-avatar" style={{ width: '64px', height: '64px', fontSize: '1.5rem', margin: '0 auto 1rem' }}>
                {(displayName || username || 'JD').substring(0, 2).toUpperCase()}
              </div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: 'var(--color-text-bright)' }}>
                {displayName || username}
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', wordBreak: 'break-all' }}>
                {username}
              </p>
            </div>

            <div className="profile-tier-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Account Tier:</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Pro Member</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Sign-In Method:</span>
                <span style={{ color: 'var(--color-text-heading)', fontWeight: 500 }}>
                  {username.includes('@gmail.com') || displayName.includes('@') ? 'Google OAuth' : 'Standard Credentials'}
                </span>
              </div>
            </div>

            <button 
              className="btn-danger" 
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* Share Modal Overlay */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-card share-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="modal-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icons.Share /> Share Analysis Session
              </h3>
              <button 
                onClick={() => setShowShareModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '1.2rem', cursor: 'pointer', padding: 0 }}
                title="Close Modal"
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              Share your conversational dataset session, query results, and visual insights with your team.
            </p>

            {/* Share Link Input */}
            <div className="share-link-group">
              <input 
                type="text" 
                readOnly 
                className="share-link-input" 
                value={`${window.location.origin}${window.location.pathname}?session=${sessionId || 'live'}`}
              />
              <button 
                className="btn-gradient" 
                onClick={handleCopyShareLink}
                style={{ padding: '0.6rem 1rem', fontSize: '0.8rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                {shareCopied ? '✓ Copied!' : '📋 Copy Link'}
              </button>
            </div>

            {/* Additional Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {navigator.share && (
                <button className="btn-secondary" style={{ flex: 1 }} onClick={handleNativeShare}>
                  📲 Share via App
                </button>
              )}
              <button className="btn-secondary" style={{ flex: 1 }} onClick={handleExportChatJSON}>
                📥 Export Chat JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast.visible && (
        <div className={`app-toast toast-${toast.type}`}>
          <span className="toast-text">{toast.message}</span>
          <button className="toast-close-btn" onClick={() => setToast(prev => ({ ...prev, visible: false }))}>✕</button>
        </div>
      )}
    </div>
  );
}
