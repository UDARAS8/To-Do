import React from 'react';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-950 via-purple-950 to-slate-900 p-4 font-sans text-slate-200 overflow-hidden relative">
      {/* Background Animated Blobs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl relative z-10 transition-all duration-500 hover:shadow-pink-500/20 hover:border-white/20 mt-4 mb-4">
        {/* Glowing Top Border */}
        <div className="absolute top-0 left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
        
        <div className="text-center mb-8 mt-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 shadow-xl shadow-purple-500/30 mb-6 transform transition-transform hover:scale-110 hover:-rotate-3 duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">
            Create Account
          </h1>
          <p className="text-slate-400 text-sm">Join us and start organizing your tasks today.</p>
        </div>

        <form className="space-y-5">
          <div className="space-y-4">
            
            <div className="group">
              <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2 ml-1 transition-colors group-focus-within:text-pink-400">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-500 group-focus-within:text-pink-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-white/5 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 focus:bg-slate-900 transition-all duration-300"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2 ml-1 transition-colors group-focus-within:text-pink-400">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-500 group-focus-within:text-pink-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-white/5 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 focus:bg-slate-900 transition-all duration-300"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2 ml-1 transition-colors group-focus-within:text-pink-400">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-500 group-focus-within:text-pink-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input 
                  type="password" 
                  placeholder="Create a strong password" 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-white/5 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 focus:bg-slate-900 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="button" 
              className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-[0_10px_20px_-10px_rgba(219,39,119,0.6)] hover:shadow-[0_15px_30px_-10px_rgba(219,39,119,0.8)] active:translate-y-0 active:shadow-md flex justify-center items-center gap-2"
            >
              <span>Sign Up</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-white hover:text-pink-400 transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;