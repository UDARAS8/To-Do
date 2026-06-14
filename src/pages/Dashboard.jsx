import React, { useState, useEffect, useMemo } from 'react';
import { sendEmailNotification } from '../utils/emailService';

// Helper components
const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#131525]/95 backdrop-blur-md border border-[#7c5cfc]/30 rounded-2xl p-4 shadow-2xl shadow-[#7c5cfc]/10 flex gap-3 transition-all duration-300">
      <div className="w-10 h-10 rounded-full bg-[#7c5cfc]/10 flex items-center justify-center text-[#7c5cfc] flex-shrink-0">
        ✉️
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-white mb-0.5">{toast.title}</h4>
        <p className="text-xs text-slate-400 leading-tight">{toast.message}</p>
      </div>
      <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors flex-shrink-0 self-start">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};

const OutboxDrawer = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);

  const loadLogs = () => {
    const saved = localStorage.getItem('ape-email-log');
    if (saved) {
      setLogs(JSON.parse(saved));
    } else {
      setLogs([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadLogs();
      setSelectedMail(null);
    }
    
    const handleUpdate = () => {
      loadLogs();
    };
    window.addEventListener('ape-email-log-updated', handleUpdate);
    return () => window.removeEventListener('ape-email-log-updated', handleUpdate);
  }, [isOpen]);

  const clearLogs = () => {
    if (confirm('Are you sure you want to clear the entire outbox log?')) {
      localStorage.removeItem('ape-email-log');
      setLogs([]);
      setSelectedMail(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-[#0d0f1a] border-l border-white/10 text-slate-200 shadow-2xl flex flex-col h-full transform transition-all duration-300">
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>✉️ Email Outbox Log</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#7c5cfc]/20 text-[#7c5cfc]">{logs.length} Sent</span>
              </h2>
              <p className="text-xs text-slate-400">Track and preview automated email dispatches</p>
            </div>
            <div className="flex items-center gap-3">
              {logs.length > 0 && (
                <button onClick={clearLogs} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" title="Clear all logs">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              )}
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className={`overflow-y-auto p-4 space-y-2 border-r border-white/5 transition-all ${selectedMail ? 'w-1/2' : 'w-full'}`}>
              {logs.length === 0 ? (
                <div className="text-center py-20 text-slate-500 space-y-3">
                  <span className="text-4xl block">📬</span>
                  <p className="text-sm font-semibold">No emails sent yet.</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">Create tasks, toggle task statuses, or run a test email in settings to trigger notifications!</p>
                </div>
              ) : (
                logs.map(log => (
                  <div key={log.id} onClick={() => setSelectedMail(log)} className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${selectedMail?.id === log.id ? 'bg-[#7c5cfc]/10 border-[#7c5cfc]/40' : 'bg-slate-900/40 border-white/5 hover:border-white/10 hover:bg-slate-800/40'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded bg-white/5">{log.event.replace('_', ' ')}</span>
                      <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white truncate mb-1">{log.subject}</h4>
                    <p className="text-xs text-slate-400 mb-2 truncate">To: {log.to}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${log.status === 'sent' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{log.status.toUpperCase()}</span>
                      <span className="text-[10px] text-slate-500 italic">via {log.provider}</span>
                    </div>
                    {log.error && (
                      <p className="text-[10px] text-red-400 mt-2 p-1.5 bg-red-500/5 rounded border border-red-500/10 leading-tight truncate">{log.error}</p>
                    )}
                  </div>
                ))
              )}
            </div>
            {selectedMail && (
              <div className="w-1/2 flex flex-col bg-slate-950/40 h-full overflow-hidden">
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-900/20">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wide">HTML Email Preview</h3>
                    <p className="text-[10px] text-slate-400">Isolated Preview Environment</p>
                  </div>
                  <button onClick={() => setSelectedMail(null)} className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors">Close Preview</button>
                </div>
                <div className="p-4 text-xs space-y-1 bg-slate-900/10 border-b border-white/5">
                  <div className="flex"><span className="w-16 font-semibold text-slate-500">Subject:</span><span className="text-slate-200 font-medium truncate">{selectedMail.subject}</span></div>
                  <div className="flex"><span className="w-16 font-semibold text-slate-500">To:</span><span className="text-slate-200 font-medium">{selectedMail.to}</span></div>
                  <div className="flex"><span className="w-16 font-semibold text-slate-500">Status:</span><span className={`${selectedMail.status === 'sent' ? 'text-green-400' : 'text-red-400'} font-bold`}>{selectedMail.status.toUpperCase()}</span></div>
                </div>
                <div className="flex-1 p-4 bg-slate-950 overflow-hidden flex flex-col">
                  <iframe 
                    srcDoc={selectedMail.html} 
                    title="Email Preview Frame"
                    className="w-full h-full bg-white rounded-xl border border-white/10"
                    sandbox="allow-popups"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [project, setProject] = useState('Marketing');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, project, priority, dueDate: dueDate || new Date().toISOString().split('T')[0], status: 'pending', id: Date.now() });
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0d0f1a] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Create New Task</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Task Name</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 bg-slate-900/50 border border-white/5 rounded-lg text-white focus:outline-none focus:border-[#7c5cfc]/50 focus:ring-1 focus:ring-[#7c5cfc]/50" placeholder="E.g. Design homepage" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Project</label>
            <select value={project} onChange={e => setProject(e.target.value)} className="w-full px-4 py-2 bg-slate-900/50 border border-white/5 rounded-lg text-white focus:outline-none focus:border-[#7c5cfc]/50 focus:ring-1 focus:ring-[#7c5cfc]/50">
              <option value="Marketing">Marketing</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Customer Success">Customer Success</option>
              <option value="Internal">Internal</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full px-4 py-2 bg-slate-900/50 border border-white/5 rounded-lg text-white focus:outline-none focus:border-[#7c5cfc]/50 focus:ring-1 focus:ring-[#7c5cfc]/50">
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Due Date</label>
            <input required type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-4 py-2 bg-slate-900/50 border border-white/5 rounded-lg text-white focus:outline-none focus:border-[#7c5cfc]/50 focus:ring-1 focus:ring-[#7c5cfc]/50" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium bg-[#7c5cfc] hover:bg-[#7c5cfc]/90 text-white transition-colors shadow-lg shadow-[#7c5cfc]/20">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PriorityBadge = ({ priority }) => {
  const colors = {
    High: 'text-red-400 bg-red-400/10 border-red-400/20',
    Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    Low: 'text-green-400 bg-green-400/10 border-green-400/20'
  };
  return <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${colors[priority]}`}>{priority}</span>;
};

const SettingsComponent = ({ userName, setUserName }) => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [editName, setEditName] = useState(userName);
  const [email, setEmail] = useState(localStorage.getItem('registeredEmail') || 'udarawijesekara9@gmail.com');
  
  const [notifPrefs, setNotifPrefs] = useState(() => {
    const saved = localStorage.getItem('notifPrefs');
    return saved ? JSON.parse(saved) : { reminders: true, completed: true, assigned: true, digest: false, updates: false };
  });
  const [theme, setTheme] = useState('dark');
  const [accent, setAccent] = useState('bg-[#7c5cfc]');
  const [securityPrefs, setSecurityPrefs] = useState({
    twoFactor: false, loginAlerts: true
  });

  // Email Notification States
  const [emailEnabled, setEmailEnabled] = useState(() => localStorage.getItem('emailNotifEnabled') === 'true');
  const [provider, setProvider] = useState(() => localStorage.getItem('emailProvider') || 'simulator');
  const [emailjsServiceId, setEmailjsServiceId] = useState(() => localStorage.getItem('emailjsServiceId') || '');
  const [emailjsTemplateId, setEmailjsTemplateId] = useState(() => localStorage.getItem('emailjsTemplateId') || '');
  const [emailjsPublicKey, setEmailjsPublicKey] = useState(() => localStorage.getItem('emailjsPublicKey') || '');
  const [resendApiKey, setResendApiKey] = useState(() => localStorage.getItem('resendApiKey') || '');
  const [resendFromEmail, setResendFromEmail] = useState(() => localStorage.getItem('resendFromEmail') || 'onboarding@resend.dev');
  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem('webhookUrl') || '');

  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState(null);
  
  const toggleNotif = (id) => {
    const updated = { ...notifPrefs, [id]: !notifPrefs[id] };
    setNotifPrefs(updated);
    localStorage.setItem('notifPrefs', JSON.stringify(updated));
  };
  const toggleSecurity = (id) => setSecurityPrefs(p => ({ ...p, [id]: !p[id] }));
  
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUserName(editName);
    localStorage.setItem('registeredName', editName);
    localStorage.setItem('registeredEmail', email);
  };

  const handleSaveEmailConfig = (e) => {
    e.preventDefault();
    localStorage.setItem('emailNotifEnabled', emailEnabled ? 'true' : 'false');
    localStorage.setItem('emailProvider', provider);
    localStorage.setItem('emailjsServiceId', emailjsServiceId);
    localStorage.setItem('emailjsTemplateId', emailjsTemplateId);
    localStorage.setItem('emailjsPublicKey', emailjsPublicKey);
    localStorage.setItem('resendApiKey', resendApiKey);
    localStorage.setItem('resendFromEmail', resendFromEmail);
    localStorage.setItem('webhookUrl', webhookUrl);
    
    setTestResult({ success: true, message: 'Settings saved successfully!' });
    setTimeout(() => setTestResult(null), 3000);
  };

  const handleSendTestEmail = async () => {
    localStorage.setItem('emailNotifEnabled', emailEnabled ? 'true' : 'false');
    localStorage.setItem('emailProvider', provider);
    localStorage.setItem('emailjsServiceId', emailjsServiceId);
    localStorage.setItem('emailjsTemplateId', emailjsTemplateId);
    localStorage.setItem('emailjsPublicKey', emailjsPublicKey);
    localStorage.setItem('resendApiKey', resendApiKey);
    localStorage.setItem('resendFromEmail', resendFromEmail);
    localStorage.setItem('webhookUrl', webhookUrl);

    setTestSending(true);
    setTestResult(null);
    try {
      const res = await sendEmailNotification('test_email', {});
      if (res.success) {
        setTestResult({ success: true, message: 'Test email notification triggered successfully! Check outbox.' });
      } else {
        setTestResult({ success: false, message: `Failed: ${res.reason || 'Unknown error'}` });
      }
    } catch (err) {
      setTestResult({ success: false, message: `Failed: ${err.message}` });
    } finally {
      setTestSending(false);
    }
  };

  const saveSetting = (key, val, setter) => {
    setter(val);
    localStorage.setItem(key, val);
  };

  const tabs = ['Profile', 'Notifications', 'Appearance', 'Account'];

  return (
    <div className="flex h-full gap-6">
      <div className="w-64 flex flex-col gap-2 border-r border-white/5 pr-6">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === t ? 'bg-[#7c5cfc]/10 text-[#7c5cfc]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>{t}</button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto pr-2">
        {activeTab === 'Profile' && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Public Profile</h3>
            <div className="bg-[#131525] border border-white/5 rounded-2xl p-6 flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7c5cfc] to-indigo-500 flex items-center justify-center overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=${userName}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 bg-slate-800 rounded-full border border-slate-700 text-slate-300 hover:text-white">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-1">{userName}</h4>
                <p className="text-sm text-slate-400 mb-2">Product Designer</p>
                <span className="text-xs font-semibold text-[#7c5cfc] bg-[#7c5cfc]/10 px-2 py-1 rounded-md">Free Plan</span>
              </div>
            </div>
            
            <form onSubmit={handleSaveProfile} className="bg-[#131525] border border-white/5 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">First & Last Name</label>
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-4 py-2 bg-slate-900/50 border border-white/5 rounded-lg text-white focus:outline-none focus:border-[#7c5cfc]/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Role</label>
                  <input type="text" defaultValue="Product Designer" className="w-full px-4 py-2 bg-slate-900/50 border border-white/5 rounded-lg text-white focus:outline-none focus:border-[#7c5cfc]/50" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 bg-slate-900/50 border border-white/5 rounded-lg text-white focus:outline-none focus:border-[#7c5cfc]/50" />
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" className="px-4 py-2 bg-[#7c5cfc] text-white text-sm font-semibold rounded-lg hover:bg-[#7c5cfc]/90 transition-colors">Save changes</button>
              </div>
            </form>
            
            <div className="bg-[#131525] border border-white/5 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Change Password</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Current password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-slate-900/50 border border-white/5 rounded-lg text-white focus:outline-none focus:border-[#7c5cfc]/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">New password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-slate-900/50 border border-white/5 rounded-lg text-white focus:outline-none focus:border-[#7c5cfc]/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Confirm password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-slate-900/50 border border-white/5 rounded-lg text-white focus:outline-none focus:border-[#7c5cfc]/50" />
                </div>
              </div>
              <div className="pt-2">
                <button type="button" className="px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors">Update Password</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'Notifications' && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Notification Preferences</h3>
            <div className="bg-[#131525] border border-white/5 rounded-2xl p-2 divide-y divide-white/5">
              {[
                { id: 'reminders', label: 'Task reminders', desc: 'Get notified when a task is due soon' },
                { id: 'completed', label: 'Task completed', desc: 'Get notified when someone completes your task' },
                { id: 'assigned', label: 'New task assigned', desc: 'Get notified when you are assigned a new task' },
                { id: 'digest', label: 'Weekly digest', desc: 'Receive a weekly summary of your productivity' },
                { id: 'updates', label: 'Product updates', desc: 'Hear about new features and updates' }
              ].map(item => (
                <div key={item.id} className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleNotif(item.id)}>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-0.5 pointer-events-none">{item.label}</h4>
                    <p className="text-xs text-slate-400 pointer-events-none">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer pointer-events-none">
                    <input type="checkbox" className="sr-only peer" checked={notifPrefs[item.id]} readOnly />
                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c5cfc]"></div>
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Email Integration Setup</h3>
              <form onSubmit={handleSaveEmailConfig} className="bg-[#131525] border border-white/5 rounded-2xl p-6 space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-0.5">Enable Email Alerts</h4>
                    <p className="text-xs text-slate-400">Receive real-time notifications directly in your inbox</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={emailEnabled} onChange={() => setEmailEnabled(!emailEnabled)} />
                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c5cfc]"></div>
                  </label>
                </div>

                {emailEnabled && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">Delivery Channel</label>
                      <select value={provider} onChange={e => { setProvider(e.target.value); localStorage.setItem('emailProvider', e.target.value); }} className="w-full px-4 py-2 bg-slate-900/50 border border-white/5 rounded-lg text-white focus:outline-none focus:border-[#7c5cfc]/50 focus:ring-1 focus:ring-[#7c5cfc]/50">
                        <option value="simulator">Mock Simulator (No accounts needed)</option>
                        <option value="emailjs">EmailJS (Send from client)</option>
                        <option value="resend">Resend API (SaaS / API Key)</option>
                        <option value="webhook">Custom Webhook POST</option>
                      </select>
                    </div>

                    {provider === 'simulator' && (
                      <div className="p-4 bg-[#7c5cfc]/5 border border-[#7c5cfc]/20 rounded-xl text-xs text-slate-300 leading-relaxed">
                        <span className="font-semibold text-white block mb-1">💡 Simulator Mode Active</span>
                        No API keys required. Trigger task additions or status updates to view gorgeous HTML email previews instantly inside the app's Outbox Drawer (envelope icon in the header).
                      </div>
                    )}

                    {provider === 'emailjs' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-950/40 rounded-xl border border-white/5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">Service ID</label>
                          <input type="text" placeholder="e.g. service_xxxxxx" value={emailjsServiceId} onChange={e => saveSetting('emailjsServiceId', e.target.value, setEmailjsServiceId)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-[#7c5cfc]/50" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">Template ID</label>
                          <input type="text" placeholder="e.g. template_xxxxxx" value={emailjsTemplateId} onChange={e => saveSetting('emailjsTemplateId', e.target.value, setEmailjsTemplateId)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-[#7c5cfc]/50" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">Public Key</label>
                          <input type="text" placeholder="e.g. user_xxxxxx" value={emailjsPublicKey} onChange={e => saveSetting('emailjsPublicKey', e.target.value, setEmailjsPublicKey)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-[#7c5cfc]/50" />
                        </div>
                      </div>
                    )}

                    {provider === 'resend' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-950/40 rounded-xl border border-white/5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">API Key</label>
                          <input type="password" placeholder="re_xxxxxxxx" value={resendApiKey} onChange={e => saveSetting('resendApiKey', e.target.value, setResendApiKey)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-[#7c5cfc]/50" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">From Email Address</label>
                          <input type="email" placeholder="onboarding@resend.dev" value={resendFromEmail} onChange={e => saveSetting('resendFromEmail', e.target.value, setResendFromEmail)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-[#7c5cfc]/50" />
                        </div>
                        <div className="col-span-2 text-xs text-amber-400 bg-amber-400/5 p-3 rounded-lg border border-amber-400/20">
                          ⚠️ <strong>CORS Policy Notice:</strong> Resend API restricts client-side requests from localhost/browsers by default. Use webhooks or proxy domains to pass requests if direct fetching causes headers errors.
                        </div>
                      </div>
                    )}

                    {provider === 'webhook' && (
                      <div className="p-4 bg-slate-950/40 rounded-xl border border-white/5 space-y-2">
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Webhook URL</label>
                        <input type="url" placeholder="https://api.zapier.com/hooks/..." value={webhookUrl} onChange={e => saveSetting('webhookUrl', e.target.value, setWebhookUrl)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-[#7c5cfc]/50" />
                        <span className="text-[10px] text-slate-500 block">Sends a POST request containing task info and formatted HTML content to automate processes in Zapier, Make, etc.</span>
                      </div>
                    )}
                  </div>
                )}

                {testResult && (
                  <div className={`p-3 text-xs rounded-lg border ${testResult.success ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                    {testResult.message}
                  </div>
                )}

                <div className="flex gap-3 justify-end pt-2">
                  <button type="button" onClick={handleSendTestEmail} disabled={testSending} className="px-4 py-2 border border-white/10 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50">
                    {testSending ? 'Sending Test...' : 'Send Test Notification'}
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#7c5cfc] hover:bg-[#7c5cfc]/90 text-white text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-[#7c5cfc]/20">
                    Save Config
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}
        
        {activeTab === 'Appearance' && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Theme</h3>
            <div className="grid grid-cols-2 gap-6">
              <div onClick={() => setTheme('dark')} className={`bg-[#131525] ${theme === 'dark' ? 'border-2 border-[#7c5cfc]' : 'border border-white/5'} rounded-2xl p-4 cursor-pointer relative overflow-hidden transition-all`}>
                {theme === 'dark' && <div className="absolute inset-0 bg-[#7c5cfc]/5"></div>}
                <div className="h-24 bg-[#0d0f1a] rounded-lg border border-white/10 mb-3 flex p-2 gap-2">
                  <div className="w-8 bg-slate-900 rounded-md"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-900 rounded"></div>
                    <div className="h-4 w-1/2 bg-[#7c5cfc]/20 rounded"></div>
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-white text-center">Dark Mode</h4>
              </div>
              <div onClick={() => setTheme('light')} className={`bg-[#131525] ${theme === 'light' ? 'border-2 border-[#7c5cfc] opacity-100' : 'border border-white/5 opacity-50 hover:border-white/20'} rounded-2xl p-4 cursor-pointer transition-all relative overflow-hidden`}>
                {theme === 'light' && <div className="absolute inset-0 bg-[#7c5cfc]/5"></div>}
                <div className="h-24 bg-white rounded-lg border border-slate-200 mb-3 flex p-2 gap-2">
                  <div className="w-8 bg-slate-100 rounded-md"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded"></div>
                    <div className="h-4 w-1/2 bg-blue-100 rounded"></div>
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-white text-center">Light Mode</h4>
              </div>
            </div>
            
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 mt-8">Accent Color</h3>
            <div className="flex gap-4">
              {[
                { bg: 'bg-[#7c5cfc]' },
                { bg: 'bg-teal-500' },
                { bg: 'bg-orange-500' },
                { bg: 'bg-blue-500' },
                { bg: 'bg-pink-500' }
              ].map((color, i) => (
                <button key={i} onClick={() => setAccent(color.bg)} className={`w-8 h-8 rounded-full ${color.bg} ${accent === color.bg ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0d0f1a]' : 'hover:scale-110'} transition-all`}></button>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'Account' && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Security Settings</h3>
            <div className="bg-[#131525] border border-white/5 rounded-2xl p-2 divide-y divide-white/5">
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleSecurity('twoFactor')}>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-0.5 pointer-events-none">Two-factor authentication</h4>
                  <p className="text-xs text-slate-400 pointer-events-none">Add an extra layer of security to your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer pointer-events-none">
                  <input type="checkbox" className="sr-only peer" checked={securityPrefs.twoFactor} readOnly />
                  <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c5cfc]"></div>
                </label>
              </div>
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleSecurity('loginAlerts')}>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-0.5 pointer-events-none">Login alerts</h4>
                  <p className="text-xs text-slate-400 pointer-events-none">Get notified of new logins on unknown devices</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer pointer-events-none">
                  <input type="checkbox" className="sr-only peer" checked={securityPrefs.loginAlerts} readOnly />
                  <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c5cfc]"></div>
                </label>
              </div>
            </div>
            
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 mt-8">Danger Zone</h3>
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-red-500/10">
                <div>
                  <h4 className="text-sm font-semibold text-red-400 mb-1">Export Data</h4>
                  <p className="text-xs text-slate-400">Download all your data in JSON format</p>
                </div>
                <button className="px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 text-sm font-semibold rounded-lg transition-colors">Export</button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-red-400 mb-1">Delete Account</h4>
                  <p className="text-xs text-slate-400">Permanently delete your account and all data</p>
                </div>
                <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-semibold rounded-lg transition-colors">Delete Account</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOutboxOpen, setIsOutboxOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('All');
  const [userName, setUserName] = useState(localStorage.getItem('registeredName') || 'John Doe');
  
  // Search and Sort for My Tasks
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('ape-tasks');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, name: 'Redesign Landing Page', project: 'Marketing', dueDate: new Date().toISOString().split('T')[0], priority: 'High', status: 'pending' },
      { id: 2, name: 'Update User Documentation', project: 'Customer Success', dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], priority: 'Medium', status: 'pending' },
      { id: 3, name: 'Fix Navigation Bug on Mobile', project: 'Engineering', dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], priority: 'High', status: 'completed' },
      { id: 4, name: 'Weekly Team Sync', project: 'Internal', dueDate: new Date().toISOString().split('T')[0], priority: 'Low', status: 'pending' }
    ];
  });

  // Sync simulated email toast events
  useEffect(() => {
    const handleToast = (e) => {
      setToast({
        title: e.detail.title,
        message: e.detail.message,
        type: e.detail.type
      });
      setTimeout(() => setToast(null), 5000);
    };
    window.addEventListener('ape-toast', handleToast);
    return () => window.removeEventListener('ape-toast', handleToast);
  }, []);

  useEffect(() => {
    localStorage.setItem('ape-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Background task checker for due reminders
  useEffect(() => {
    const checkDueTasks = async () => {
      const todayStr = new Date().toISOString().split('T')[0];
      const notifiedTasks = JSON.parse(localStorage.getItem('ape-notified-tasks') || '{}');
      const preferences = JSON.parse(localStorage.getItem('notifPrefs') || '{}');
      
      const remindersEnabled = preferences.reminders !== false;
      if (!remindersEnabled) return;

      const pendingTasksDueToday = tasks.filter(t => t.status === 'pending' && t.dueDate === todayStr);
      let updated = false;

      for (const task of pendingTasksDueToday) {
        if (!notifiedTasks[task.id] || notifiedTasks[task.id] !== todayStr) {
          await sendEmailNotification('task_due', task);
          notifiedTasks[task.id] = todayStr;
          updated = true;
        }
      }

      if (updated) {
        localStorage.setItem('ape-notified-tasks', JSON.stringify(notifiedTasks));
      }
    };

    if (tasks.length > 0) {
      checkDueTasks();
    }
  }, [tasks]);

  const addTask = (task) => {
    setTasks(prev => [task, ...prev]);
    const preferences = JSON.parse(localStorage.getItem('notifPrefs') || '{}');
    if (preferences.assigned !== false) {
      sendEmailNotification('task_created', task);
    }
  };

  const toggleTaskStatus = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const newStatus = t.status === 'pending' ? 'completed' : 'pending';
        const updated = { ...t, status: newStatus };
        const preferences = JSON.parse(localStorage.getItem('notifPrefs') || '{}');
        if (newStatus === 'completed' && preferences.completed !== false) {
          sendEmailNotification('task_completed', updated);
        }
        return updated;
      }
      return t;
    }));
  };

  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length
  };

  const filteredTasks = useMemo(() => {
    if (filter === 'All') return tasks;
    if (filter === 'In Progress') return tasks.filter(t => t.status === 'pending');
    return tasks.filter(t => t.status === 'completed');
  }, [tasks, filter]);

  const myTasksList = useMemo(() => {
    let list = tasks.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (sortBy === 'dueDate') list.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    if (sortBy === 'priority') {
      const p = { High: 3, Medium: 2, Low: 1 };
      list.sort((a, b) => p[b.priority] - p[a.priority]);
    }
    return list;
  }, [tasks, searchQuery, sortBy]);

  const TaskRow = ({ task }) => {
    const isDone = task.status === 'completed';
    return (
      <div className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${isDone ? 'bg-slate-900/20 border-white/5 opacity-60' : 'bg-slate-900/60 border-white/10 hover:border-[#7c5cfc]/30 hover:bg-slate-800/60 shadow-sm'}`}>
        <div className="flex items-center gap-4">
          <div onClick={() => toggleTaskStatus(task.id)} className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${isDone ? 'bg-[#7c5cfc] border-[#7c5cfc]' : 'border-slate-500 hover:border-[#7c5cfc] bg-transparent'}`}>
            {isDone && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
          </div>
          <div>
            <h4 className={`text-sm font-semibold ${isDone ? 'text-slate-500 line-through' : 'text-slate-200'} mb-1`}>{task.name}</h4>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>{task.project}</span>
              <span className="w-1 h-1 rounded-full bg-slate-700"></span>
              <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{task.dueDate}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <PriorityBadge priority={task.priority} />
          <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    );
  };

  // Calendar View Logic (Simple Grid)
  const renderCalendar = () => {
    // Basic calendar: just show tasks grouped by due date in next 7 days for simplicity, or a monthly grid.
    // Let's group tasks by due date.
    const grouped = tasks.reduce((acc, task) => {
      acc[task.dueDate] = acc[task.dueDate] ? [...acc[task.dueDate], task] : [task];
      return acc;
    }, {});
    
    // Create an array of 14 days starting from today
    const dates = Array.from({length: 14}).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d.toISOString().split('T')[0];
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {dates.map(date => {
          const dayTasks = grouped[date] || [];
          return (
            <div key={date} className="bg-white/5 rounded-xl p-4 border border-white/5 min-h-[120px]">
              <h4 className="text-xs font-semibold text-slate-400 mb-3">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</h4>
              <div className="space-y-2">
                {dayTasks.map(t => (
                  <div key={t.id} className="text-xs p-2 rounded bg-slate-900/60 border border-white/10 text-slate-300 truncate">
                    <span className={`w-2 h-2 rounded-full inline-block mr-2 ${t.priority === 'High' ? 'bg-red-400' : t.priority === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'}`}></span>
                    {t.name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Projects View Logic
  const renderProjects = () => {
    const projectStats = tasks.reduce((acc, t) => {
      if (!acc[t.project]) acc[t.project] = { total: 0, completed: 0 };
      acc[t.project].total++;
      if (t.status === 'completed') acc[t.project].completed++;
      return acc;
    }, {});

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(projectStats).map(([proj, stats]) => {
          const progress = Math.round((stats.completed / stats.total) * 100);
          return (
            <div key={proj} className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-[#7c5cfc]/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#7c5cfc] to-indigo-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-white/5 px-3 py-1 rounded-full">{stats.total} Tasks</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{proj}</h3>
              <div className="mb-2 flex justify-between text-xs text-slate-400">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-[#7c5cfc] h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0d0f1a] text-slate-200 overflow-hidden flex font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/30 backdrop-blur-xl border-r border-white/5 flex flex-col pt-8 pb-4 relative z-20 hidden md:flex">
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#7c5cfc]/30 to-transparent"></div>
        
        <div className="px-8 mb-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7c5cfc] to-indigo-600 shadow-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
          </div>
          <h2 className="text-lg font-bold text-white tracking-wide">🐒 24 To-Do</h2>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {['Dashboard', 'My Tasks', 'Calendar', 'Projects', 'Settings'].map((item) => (
            <button key={item} onClick={() => setActiveTab(item)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === item ? 'bg-[#7c5cfc]/10 text-[#7c5cfc] border border-[#7c5cfc]/20' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
              <div className="w-5 h-5 flex items-center justify-center">
                {item === 'Dashboard' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
                {item === 'My Tasks' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                {item === 'Calendar' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                {item === 'Projects' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>}
                {item === 'Settings' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              </div>
              <span className="font-medium tracking-wide text-sm">{item}</span>
            </button>
          ))}
        </nav>

        <div className="px-6 mt-auto">
          <div className="p-4 bg-gradient-to-br from-[#7c5cfc]/20 to-indigo-900/20 border border-[#7c5cfc]/20 rounded-2xl relative overflow-hidden text-center">
             <div className="absolute top-0 right-0 w-24 h-24 bg-[#7c5cfc]/20 rounded-full blur-2xl"></div>
             <h4 className="text-sm font-semibold text-white mb-1 relative z-10">Go Pro!</h4>
             <p className="text-xs text-slate-400 mb-3 relative z-10">Get unlimited tasks & analytics.</p>
             <button className="w-full py-2 bg-[#7c5cfc]/20 hover:bg-[#7c5cfc]/40 text-[#7c5cfc] hover:text-white border border-[#7c5cfc]/30 text-xs font-semibold rounded-lg transition-colors relative z-10">Upgrade</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Glows */}
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[#7c5cfc]/5 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"></div>

        {/* Top bar */}
        <header className="h-20 border-b border-white/5 bg-[#0d0f1a]/80 backdrop-blur-md flex items-center justify-between px-8 relative z-10">
          <h1 className="text-2xl font-bold text-white tracking-tight">{activeTab}</h1>
          
          <div className="flex items-center gap-6">
            <button onClick={() => setIsModalOpen(true)} className="hidden sm:flex px-4 py-2 bg-[#7c5cfc] hover:bg-[#7c5cfc]/90 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-[#7c5cfc]/20 items-center gap-2">
               <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
               New Task
            </button>
            <div className="relative group cursor-pointer" title="In-App Notifications">
               <svg className="h-6 w-6 text-slate-400 hover:text-[#7c5cfc] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
               <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
             
             {/* Outbox / Email Log Button */}
             <div onClick={() => setIsOutboxOpen(true)} className="relative group cursor-pointer" title="Email Outbox Log">
                <svg className="h-6 w-6 text-slate-400 hover:text-[#7c5cfc] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="absolute top-0 right-0 w-2 h-2 bg-[#7c5cfc] rounded-full animate-pulse"></span>
             </div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{userName}</p>
                <p className="text-xs text-[#7c5cfc]">Pro Plan</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c5cfc] to-indigo-500 border-2 border-slate-800 flex items-center justify-center overflow-hidden">
                 <img src={`https://ui-avatars.com/api/?name=${userName}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          
          {activeTab === 'Dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                 <div className="bg-slate-900/40 backdrop-blur-lg border border-white/5 p-6 rounded-2xl hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                       <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg></div>
                       <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded-md">+12%</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{stats.total}</h3>
                    <p className="text-sm text-slate-400">Total Tasks</p>
                 </div>
                 <div className="bg-slate-900/40 backdrop-blur-lg border border-white/5 p-6 rounded-2xl hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                       <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                       <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded-md">+12%</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{stats.completed}</h3>
                    <p className="text-sm text-slate-400">Completed</p>
                 </div>
                 <div className="bg-slate-900/40 backdrop-blur-lg border border-white/5 p-6 rounded-2xl hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                       <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                       <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded-md">+12%</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{stats.pending}</h3>
                    <p className="text-sm text-slate-400">Pending</p>
                 </div>
              </div>

              {/* Recent Tasks */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Recent Tasks</h3>
                  <div className="flex gap-2">
                     {['All', 'In Progress', 'Completed'].map(f => (
                       <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-[#7c5cfc]/20 text-[#7c5cfc] border border-[#7c5cfc]/20' : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                         {f}
                       </button>
                     ))}
                  </div>
                </div>
                <div className="space-y-3">
                  {filteredTasks.slice(0, 5).map(task => <TaskRow key={task.id} task={task} />)}
                  {filteredTasks.length === 0 && <div className="text-center py-8 text-slate-500 text-sm">No tasks found.</div>}
                </div>
              </div>
            </>
          )}

          {activeTab === 'My Tasks' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div className="relative w-full md:w-64">
                  <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-[#7c5cfc]/50" />
                  <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400">Sort by:</span>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2 bg-slate-900/50 border border-white/5 rounded-lg text-sm text-white focus:outline-none">
                    <option value="dueDate">Due Date</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                 {myTasksList.map(task => <TaskRow key={task.id} task={task} />)}
                 {myTasksList.length === 0 && <div className="text-center py-10 text-slate-500">No matching tasks.</div>}
              </div>
            </div>
          )}

          {activeTab === 'Calendar' && renderCalendar()}
          
          {activeTab === 'Projects' && renderProjects()}
          
          {activeTab === 'Settings' && (
            <SettingsComponent userName={userName} setUserName={setUserName} />
          )}
          
        </div>
        
        {/* Floating Add Button for Mobile */}
        <button onClick={() => setIsModalOpen(true)} className="md:hidden absolute bottom-6 right-6 w-14 h-14 bg-[#7c5cfc] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#7c5cfc]/30 z-20">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={addTask} />
      <OutboxDrawer isOpen={isOutboxOpen} onClose={() => setIsOutboxOpen(false)} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default Dashboard;
