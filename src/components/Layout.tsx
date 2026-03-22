import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bike, LayoutDashboard, Home, User, LogOut, LogIn } from 'lucide-react';
import { auth } from '../firebase';
import { useAuth } from '../App';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, profile, loading, signIn } = useAuth();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/bikes', label: 'Bikes', icon: Bike },
  ];

  if (profile?.role === 'admin') {
    navItems.push({ path: '/admin', label: 'Admin', icon: LayoutDashboard });
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
                <Bike size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight">MotoInstall</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-black ${
                    location.pathname === item.path ? 'text-black' : 'text-gray-500'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {!loading && (
                user ? (
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Welcome</p>
                      <p className="text-sm font-medium">{profile?.name || user.displayName}</p>
                    </div>
                    <button
                      onClick={() => auth.signOut()}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-red-600"
                      title="Logout"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={signIn}
                    className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all shadow-lg shadow-black/10"
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>

      <footer className="bg-white border-t border-black/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
                  <Bike size={18} />
                </div>
                <span className="text-lg font-bold tracking-tight">MotoInstall</span>
              </div>
              <p className="text-gray-500 max-w-sm leading-relaxed">
                Pakistan's leading platform for motorcycle installments. We make it easy for students, riders, and employees to own their dream bike.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-gray-400">Quick Links</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-600">
                <li><Link to="/bikes" className="hover:text-black transition-colors">Browse Bikes</Link></li>
                <li><Link to="/" className="hover:text-black transition-colors">EMI Calculator</Link></li>
                <li><Link to="/admin" className="hover:text-black transition-colors">Admin Portal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-gray-400">Contact</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-600">
                <li>support@motoinstall.pk</li>
                <li>+92 300 1234567</li>
                <li>Karachi, Pakistan</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 text-center text-xs text-gray-400 font-medium uppercase tracking-widest">
            © 2026 MotoInstall. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
