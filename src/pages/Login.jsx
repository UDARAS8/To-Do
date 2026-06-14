import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const validEmail = localStorage.getItem('registeredEmail') || 'udarawijesekara9@gmail.com';
    const validPassword = localStorage.getItem('registeredPassword') || '12345678';

    if (email === validEmail && password === validPassword) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0f1a] p-4 text-slate-200 overflow-hidden relative">
      {/* Background Animated Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7c5cfc]/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl relative z-10 transition-all duration-500 hover:shadow-[#7c5cfc]/10 hover:border-white/20">
        {/* Glowing Top Border */}
        <div className="absolute top-0 left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-[#7c5cfc] to-transparent"></div>
        
        <div className="text-center mb-10 mt-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7c5cfc] to-indigo-600 shadow-xl shadow-[#7c5cfc]/30 mb-6 transform transition-transform hover:scale-110 hover:rotate-3 duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">
            24 To-Do
          </h1>
          <p className="text-slate-400 text-sm">Sign in to manage your tasks</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="group">
              <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2 ml-1 transition-colors group-focus-within:text-[#7c5cfc]">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-500 group-focus-within:text-[#7c5cfc] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-white/5 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#7c5cfc]/50 focus:border-[#7c5cfc]/50 focus:bg-[#0d0f1a] transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="group">
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase transition-colors group-focus-within:text-[#7c5cfc]">Password</label>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-medium text-[#7c5cfc] hover:text-[#7c5cfc]/80 transition-colors cursor-pointer">Forgot Password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-500 group-focus-within:text-[#7c5cfc] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-white/5 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#7c5cfc]/50 focus:border-[#7c5cfc]/50 focus:bg-[#0d0f1a] transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="flex items-center ml-1">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 text-[#7c5cfc] focus:ring-[#7c5cfc]/50 focus:ring-offset-gray-900 bg-slate-800 accent-[#7c5cfc]"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-slate-400 cursor-pointer hover:text-slate-300">
                Remember me
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#7c5cfc] to-indigo-600 hover:from-[#7c5cfc]/90 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-[0_10px_20px_-10px_rgba(124,92,252,0.6)] hover:shadow-[0_15px_30px_-10px_rgba(124,92,252,0.8)] active:translate-y-0 active:shadow-md flex justify-center items-center gap-2"
          >
            <span>Sign in</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-white hover:text-[#7c5cfc] transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;