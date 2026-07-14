import React, { useState, useEffect, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000/api';

const PROVIDER_MODELS = {
  Gemini: ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'],
  Groq: ['llama-3.3-70b-versatile', 'llama3-8b-8192', 'mixtral-8x7b-32768']
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
  Spark: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
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
  )
};

export default function App() {
  // Auth State
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [displayName, setDisplayName] = useState(localStorage.getItem('displayName') || '');
  const [authMode, setAuthMode] = useState('LOGIN'); // LOGIN, REGISTER, FORGOT_PASSWORD, RESET_PASSWORD
  const [loginEmail, setLoginEmail] = useState('admin@company.com');
  const [loginPass, setLoginPass] = useState('password123');
  
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
  const [model, setModel] = useState('llama-3.3-70b-versatile');
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

  // Render Login Screen if not authenticated
  if (!token) {
    return (
      <div className="auth-container">


        {authMode === 'LOGIN' && (
          <form className="auth-card" onSubmit={handleLogin}>
            <div className="auth-header">
              <h1 className="auth-logo">DataWhisperer</h1>
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
        <h1 className="sidebar-title">DataWhisperer</h1>

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
            <option value="Groq">Groq (Llama 3)</option>
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
          <div className="chats-list" style={{ maxHeight: '180px', overflowY: 'auto' }}>
            {sessions.length === 0 ? (
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', padding: '0.5rem', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '6px' }}>
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
              <div className="dropzone disabled" style={{ cursor: 'not-allowed', borderColor: 'rgba(168, 85, 247, 0.2)', background: 'rgba(168, 85, 247, 0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ width: '1.5rem', height: '1.5rem', border: '3px solid rgba(168, 85, 247, 0.3)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '0.5rem' }}></div>
                <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>Waking up AI Engine...</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>Free servers take ~30s to boot up.</div>
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
            <button className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }} onClick={() => alert('Invite Link copied to Clipboard!')}>
              <Icons.Share /> Share
            </button>
            <span style={{ color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }}><Icons.Broadcast /></span>
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
                          <Icons.Spark /> DataWhisperer AI
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
          <div ref={chatEndRef} />
        </div>

        {/* Input Form Bar */}
        <div className="chat-input-container">
          <form className="chat-input-wrapper" onSubmit={handleQuery}>
            <button 
              type="button" 
              className="chat-input-action-btn"
              onClick={() => alert('Attachment system: Select a file to append.')}
            >
              <Icons.Paperclip />
            </button>
            <input 
              type="text" 
              className="chat-input" 
              placeholder={dataset ? "Ask about EMEA trends or dataset specifics..." : "Please upload a dataset first"}
              disabled={!dataset || loading}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
            />
            <button 
              type="button" 
              className="chat-input-action-btn"
              onClick={() => alert('Voice activation: Dictate your analysis query.')}
            >
              <Icons.Mic />
            </button>
            <button 
              type="submit" 
              className="chat-submit-circle-btn" 
              disabled={!dataset || loading || !prompt.trim()}
            >
              <Icons.Send />
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
                {displayName || (username === 'admin' ? 'John Doe' : username)}
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', wordBreak: 'break-all' }}>
                {username}
              </p>
            </div>

            <div style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              borderRadius: '8px', 
              padding: '1rem', 
              marginBottom: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Account Tier:</span>
                <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Pro Member</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Sign-In Method:</span>
                <span style={{ color: 'var(--color-text-bright)' }}>
                  {username.includes('@gmail.com') || displayName.includes('@') ? 'Google OAuth' : 'Standard Credentials'}
                </span>
              </div>
            </div>

            <button 
              className="btn-gradient" 
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }} 
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
