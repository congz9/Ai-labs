import { useState, useEffect } from 'react';
import { Mail, Phone, ChevronRight, Facebook, Github, Twitter, Send, Youtube, MessageCircle, Settings, Chrome, Zap, LogOut, User, Film, Clapperboard, MonitorPlay, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BackgroundCanvas from './components/BackgroundCanvas';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import { Project, ProfileInfo } from './types';
import { getProjects, getProfile, seedDatabase } from './services/projectService';
import { auth, logout } from './lib/firebase';
import { getDirectImageUrl } from './lib/imageUtils';
import { PRESET_ICONS_MAP, getIconConfig } from './lib/presetIcons';

const ADMIN_EMAILS = ['giangcong1089@gmail.com', 'giangcong10899@gmail.com', 'congga@s-connect.net'];

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [activeContact, setActiveContact] = useState<string | null>(null);

  useEffect(() => {
    if (activeContact) {
      const timer = setTimeout(() => setActiveContact(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [activeContact]);

  useEffect(() => {
    fetchData();
    const unsubscribe = auth?.onAuthStateChanged(async (user) => {
      if (user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        setIsAdmin(true);
        // If admin, check and seed database if empty
        const seeded = await seedDatabase();
        if (seeded) {
          fetchData(); // Refresh data after seeding
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe?.();
  }, []);

  const fetchData = async () => {
    const [pList, prof] = await Promise.all([getProjects(), getProfile()]);
    setProjects(pList);
    setProfile(prof);
  };

  const handleLogout = async () => {
    await logout();
    setIsAdmin(false);
    setShowAdminPanel(false);
  };

  if (!profile) return null;

  return (
    <div className="relative min-h-screen flex flex-col">
      <BackgroundCanvas />
      
      {/* Full-width Header Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full">
        <nav className="nav-luxury px-8 md:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-help" onClick={() => !isAdmin && setShowLoginModal(true)}>
            {profile.logo && (
              <img src={getDirectImageUrl(profile.logo)} alt="Logo" className="w-10 h-10 object-contain" />
            )}
            <span className="text-xl font-extrabold tracking-tighter text-slate-900">
              {profile.name}<span className="text-blue-500">{profile.brandName}</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-10 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">
            <a href="#projects" className="hover:text-blue-600 transition-colors">DỰ ÁN & CÔNG CỤ</a>
            {isAdmin && (
              <button 
                onClick={() => setShowAdminPanel(true)}
                className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-all flex items-center gap-2"
              >
                <Settings size={14} /> ADMIN
              </button>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-5 text-slate-400">
              <a href={profile.facebook} target="_blank" rel="noopener noreferrer" title="Facebook" className="hover:text-blue-500 transition-colors duration-300">
                <Facebook size={18} />
              </a>
              <div className="relative flex items-center justify-center">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(profile.email);
                    setActiveContact('email');
                  }}
                  className={`hover:text-slate-900 transition-colors duration-300 cursor-pointer flex items-center ${activeContact === 'email' ? 'text-blue-600' : ''}`}
                >
                  <Mail size={18} />
                </button>
                <AnimatePresence>
                  {activeContact === 'email' && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.9, y: 10, x: '-50%' }}
                      animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
                      exit={{ opacity: 0, scale: 0.9, y: 5, x: '-50%' }}
                      className="text-[10px] font-bold absolute bottom-full mb-3 left-1/2 whitespace-nowrap bg-white text-slate-800 px-3 py-1.5 rounded-lg shadow-lg border border-slate-100 z-50 pointer-events-none"
                    >
                      {profile.email} (Copied!)
                      <div className="absolute top-[calc(100%-4px)] left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-slate-100 rotate-45" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative flex items-center justify-center">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(profile.phone);
                    setActiveContact('phone');
                  }}
                  className={`hover:text-teal-500 transition-colors duration-300 cursor-pointer flex items-center ${activeContact === 'phone' ? 'text-teal-600' : ''}`}
                >
                  <Phone size={18} />
                </button>
                <AnimatePresence>
                  {activeContact === 'phone' && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.9, y: 10, x: '-50%' }}
                      animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
                      exit={{ opacity: 0, scale: 0.9, y: 5, x: '-50%' }}
                      className="text-[10px] font-bold absolute bottom-full mb-3 left-1/2 whitespace-nowrap bg-white text-teal-800 px-3 py-1.5 rounded-lg shadow-lg border border-slate-100 z-50 pointer-events-none"
                    >
                      {profile.phone} (Copied!)
                      <div className="absolute top-[calc(100%-4px)] left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-slate-100 rotate-45" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              {isAdmin && (
                <button onClick={handleLogout} className="hover:text-red-500 transition-colors duration-300">
                  <LogOut size={18} />
                </button>
              )}
            </div>
          </div>
        </nav>
      </div>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-8 pt-32 pb-4">
        {/* Dynamic Header Section */}
        <div className="mb-16 relative">
          <motion.div 
            className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="w-8 h-px bg-blue-500/30"></span>
            DỰ ÁN CỦA TÔI
          </motion.div>
        </div>

        {/* Project Grid */}
        <motion.div 
          id="projects" 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {projects.map((project) => (
            <motion.a
              key={project.id || project.title}
              href={project.link}
              target={project.link !== '#' ? "_blank" : undefined}
              rel={project.link !== '#' ? "noopener noreferrer" : undefined}
              className="glass-card p-10 group flex gap-8 items-center relative overflow-hidden min-h-[160px]"
              variants={{
                hidden: { opacity: 0, scale: 0.95, y: 20 },
                show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              whileHover={{ 
                scale: 1.02, 
                translateY: -8,
                transition: { duration: 0.3 }
              }}
            >
              {/* Subtle Ambient Glow */}
              <div className={`absolute -inset-1 bg-gradient-to-br ${project.gradient} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500 -z-10`} />

              <div className="relative shrink-0">
                <div 
                  className={`w-[84px] h-[84px] rounded-full flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-110 ${
                    (project.icons && project.icons.length > 0) || project.icon
                      ? 'bg-transparent'
                      : project.iconType && project.iconType !== 'loading'
                      ? `${getIconConfig(project.iconType).bgClass} shadow-xl ring-1 ring-slate-100/50`
                      : 'bg-white shadow-xl ring-1 ring-slate-100'
                  }`}
                  style={project.iconBg ? { backgroundColor: project.iconBg } : {}}
                >
                  {(project.icons && project.icons.length > 0) ? (
                    <img 
                      src={getDirectImageUrl(project.icons[0])} 
                      alt="AI Logo" 
                      className={`w-full h-full object-cover transition-transform duration-500 ${project.icons[0].includes('X_logo') ? 'grayscale brightness-0' : ''}`} 
                      referrerPolicy="no-referrer" 
                      crossOrigin="anonymous" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://www.gstatic.com/lamda/images/favicon_v2_71db81395775361cfed.ico';
                      }}
                    />
                  ) : project.icon ? (
                    <img 
                      src={getDirectImageUrl(project.icon)} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-500" 
                      referrerPolicy="no-referrer" 
                      crossOrigin="anonymous" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const iconContent = document.createElement('div');
                          iconContent.className = 'text-blue-500 flex items-center justify-center';
                          
                          // Custom fallback for MOHO
                          if (project.title.toUpperCase().includes('MOHO')) {
                            iconContent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-film"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M17 3v18"/><path d="M3 7h4"/><path d="M3 12h4"/><path d="M3 17h4"/><path d="M17 7h4"/><path d="M17 12h4"/><path d="M17 17h4"/></svg>';
                          } else {
                            iconContent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';
                          }
                          parent.appendChild(iconContent);
                        }
                      }}
                    />
                  ) : project.iconType === 'loading' ? (
                    <div className="flex items-center justify-center bg-white w-full h-full shadow-xl ring-1 ring-slate-100">
                      <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                  ) : PRESET_ICONS_MAP[project.iconType || 'default'] ? (
                    (() => {
                      const IconComponent = PRESET_ICONS_MAP[project.iconType || 'default'];
                      const config = getIconConfig(project.iconType);
                      return (
                        <IconComponent size={36} className={`${config.colorClass} drop-shadow-sm`} />
                      );
                    })()
                  ) : (
                    <div className="flex flex-col items-center justify-center text-blue-600 leading-none bg-white w-full h-full shadow-xl ring-1 ring-slate-100">
                      <Zap size={32} className="mb-0.5 text-blue-500 drop-shadow-sm" />
                      <span className="font-extrabold text-[8px] tracking-tighter">VEO3</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col min-w-0">
                <h3 className="text-[15px] font-black tracking-tight text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-[12px] text-slate-500 font-medium leading-relaxed line-clamp-3">
                  {project.description}
                </p>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </motion.a>
          ))}
        </motion.div>
      </main>

      <footer className="mt-auto w-full max-w-[1400px] mx-auto px-8 pb-10">
        <div className="pt-8 border-t border-slate-200/50">
          <div className="flex justify-center items-center gap-12 md:gap-20">
            <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-400 hover:text-blue-600 transition-all duration-300 group">
              <Facebook size={16} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold">FACEBOOK</span>
            </a>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(profile.email);
                setActiveContact('email-footer');
              }}
              className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-all duration-300 group relative"
            >
              <Mail size={16} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] tracking-[0.25em] lowercase font-bold">
                {activeContact === 'email-footer' ? 'COPIED!' : profile.email}
              </span>
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(profile.phone);
                setActiveContact('phone-footer');
              }}
              className="flex items-center gap-3 text-slate-400 hover:text-teal-600 transition-all duration-300 group relative"
            >
              <Phone size={16} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold">
                {activeContact === 'phone-footer' ? 'COPIED!' : profile.phone}
              </span>
            </button>
          </div>
        </div>
      </footer>

      {/* Overlays */}
      <AnimatePresence>
        {showLoginModal && (
          <LoginModal 
            onSuccess={() => setShowLoginModal(false)}
            onClose={() => setShowLoginModal(false)}
          />
        )}
        {showAdminPanel && (
          <AdminPanel 
            projects={projects}
            profile={profile}
            onRefresh={fetchData}
            onClose={() => setShowAdminPanel(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
