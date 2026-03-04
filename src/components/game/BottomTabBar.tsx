import { Home, Gamepad2, Crosshair, Trophy, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/game', icon: Gamepad2, label: 'Game' },
  { path: '/ar', icon: Crosshair, label: 'AR Hunt' },
  { path: '/leaderboard', icon: Trophy, label: 'Ranks' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on AR screen
  if (location.pathname === '/ar') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 safe-area-bottom">
      <div className="mx-3 mb-2 rounded-2xl border border-border/50 overflow-hidden"
           style={{
             background: 'linear-gradient(135deg, hsl(var(--cyber-card) / 0.9), hsl(var(--cyber-darker) / 0.95))',
             backdropFilter: 'blur(20px)',
           }}>
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const active = location.pathname === tab.path;
            const Icon = tab.icon;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center gap-0.5 py-1 px-3 relative"
              >
                {active && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -top-1 w-8 h-0.5 rounded-full bg-primary"
                    style={{ boxShadow: '0 0 8px hsl(var(--neon-green))' }}
                  />
                )}
                <Icon className={`w-5 h-5 transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-[10px] font-mono tracking-wider uppercase transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
