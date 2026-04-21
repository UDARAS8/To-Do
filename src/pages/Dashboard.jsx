import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 overflow-hidden flex">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 flex flex-col pt-8 pb-4 relative z-20 hidden md:flex">
        {/* Glow effect on sidebar */}
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-violet-500/50 to-transparent"></div>
        
        <div className="px-8 mb-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">Ape To-Do</h2>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {['Dashboard', 'My Tasks', 'Calendar', 'Projects', 'Settings'].map((item, idx) => (
            <a 
              key={idx} 
              href="#" 
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                idx === 0 
                  ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20 shadow-[inset_0L_0_0_1px_rgba(139,92,246,0.5)]' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {idx === 0 && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
                {idx === 1 && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                {idx === 2 && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                {idx === 3 && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>}
                {idx === 4 && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              </div>
              <span className="font-medium tracking-wide text-sm">{item}</span>
            </a>
          ))}
        </nav>

        <div className="px-6 mt-auto">
          <div className="p-4 bg-gradient-to-br from-indigo-900/40 to-violet-900/20 border border-violet-500/10 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/20 rounded-full blur-2xl"></div>
             <h4 className="text-sm font-semibold text-white mb-1 relative z-10">Go Pro!</h4>
             <p className="text-xs text-slate-400 mb-3 relative z-10">Get unlimited tasks and advanced analytics.</p>
             <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors relative z-10">
               Upgrade
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-violet-600/10 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] bg-indigo-600/10 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"></div>

        {/* Header */}
        <header className="h-20 border-b border-white/5 bg-slate-900/30 backdrop-blur-md flex items-center justify-between px-8 relative z-10">
          <div className="flex items-center gap-4">
             <button className="md:hidden p-2 text-slate-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
             </button>
             <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 group-hover:text-violet-400 transition-colors cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
               </svg>
               <span className="absolute top-0 right-0 w-2 h-2 bg-pink-500 rounded-full"></span>
            </div>
            
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">John Doe</p>
                <p className="text-xs text-slate-500">Free Plan</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 border-2 border-slate-800 shadow-lg flex items-center justify-center overflow-hidden">
                 <img src="https://ui-avatars.com/api/?name=John+Doe&background=random" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          
          {/* Welcome Section */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
             <div>
               <h2 className="text-3xl font-bold text-white mb-2">Good morning, John! 
                ☀️</h2>
               <p className="text-slate-400">You have <span className="text-violet-400 font-semibold">4 pending tasks</span> today.</p>
             </div>
             
             <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all flex items-center gap-2 transform hover:-translate-y-1">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
               </svg>
               New Task
             </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
             {[
               { title: 'Total Tasks', count: '24', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/20' },
               { title: 'Completed', count: '16', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20' },
               { title: 'Pending', count: '8', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'from-orange-500 to-amber-500', shadow: 'shadow-orange-500/20' }
             ].map((stat, i) => (
               <div key={i} className="bg-slate-900/40 backdrop-blur-lg border border-white/5 p-6 rounded-3xl hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                     <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${stat.color} flex items-center justify-center shadow-lg ${stat.shadow}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                        </svg>
                     </div>
                     <span className="text-xs font-semibold text-slate-400 bg-white/5 px-3 py-1 rounded-full">+12%</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-1">{stat.count}</h3>
                    <p className="text-sm text-slate-400">{stat.title}</p>
                  </div>
               </div>
             ))}
          </div>

          {/* Tasks List Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Recent Tasks</h3>
              <div className="flex gap-2">
                 {['All', 'In Progress', 'Completed'].map((filter, i) => (
                   <button key={i} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${i === 0 ? 'bg-violet-600/20 text-violet-400 border border-violet-500/20' : 'bg-slate-900/40 text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-white/5'}`}>
                     {filter}
                   </button>
                 ))}
              </div>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Redesign Landing Page', project: 'Marketing', time: 'Today', priority: 'High', priorityColor: 'text-rose-400 bg-rose-400/10 border-rose-400/20', isDone: false },
                { title: 'Update User Documentation', project: 'Customer Success', time: 'Tomorrow', priority: 'Medium', priorityColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20', isDone: false },
                { title: 'Fix Navigation Bug on Mobile', project: 'Engineering', time: 'In 2 days', priority: 'High', priorityColor: 'text-rose-400 bg-rose-400/10 border-rose-400/20', isDone: true },
                { title: 'Weekly Team Sync', project: 'Internal', time: 'Today, 2:00 PM', priority: 'Low', priorityColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', isDone: false }
              ].map((task, i) => (
                <div key={i} className={`group flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${task.isDone ? 'bg-slate-900/20 border-white/5 opacity-60' : 'bg-slate-900/60 border-white/10 hover:border-violet-500/30 hover:bg-slate-800/60 shadow-sm'}`}>
                  
                  <div className="flex items-center gap-5">
                    {/* Custom Checkbox */}
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center cursor-pointer transition-colors ${task.isDone ? 'bg-violet-500 border-violet-500' : 'border-slate-600 group-hover:border-violet-500 bg-slate-900'}`}>
                       {task.isDone && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>

                    <div>
                      <h4 className={`text-base font-semibold ${task.isDone ? 'text-slate-500 line-through' : 'text-slate-200'} mb-1`}>{task.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                         <span className="flex items-center gap-1">
                           <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                           {task.project}
                         </span>
                         <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                         <span className="flex items-center gap-1">
                           <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           {task.time}
                         </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                     <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${task.priorityColor}`}>
                       {task.priority}
                     </span>
                     
                     <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-violet-400 hover:bg-violet-400/10 rounded-lg transition-colors">
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors">
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                     </div>
                  </div>

                </div>
              ))}
            </div>
            
          </div>
          
        </div>
      </main>
      
    </div>
  );
};

export default Dashboard;
