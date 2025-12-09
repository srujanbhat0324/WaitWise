import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Building2, LayoutDashboard, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">W</span>
                        </div>
                        <span className="text-xl font-bold text-slate-800">WaitWise</span>
                    </Link>

                    {/* Desktop Navigation */}
                    {user && (
                        <div className="hidden md:flex items-center space-x-6">
                            <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                                <Home size={18} />
                                <span>Home</span>
                            </Link>
                            <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                                <Building2 size={18} />
                                <span>Offices</span>
                            </Link>
                            {user.role === 'user' && (
                                <Link to="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                                    <LayoutDashboard size={18} />
                                    <span>Dashboard</span>
                                </Link>
                            )}
                            {user.role === 'dept_admin' && (
                                <Link to="/dept-admin" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                                    <LayoutDashboard size={18} />
                                    <span>Admin Panel</span>
                                </Link>
                            )}
                            {user.role === 'super_admin' && (
                                <Link to="/admin" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                                    <LayoutDashboard size={18} />
                                    <span>Super Admin</span>
                                </Link>
                            )}
                            <Link to="/profile" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                                <User size={18} />
                                <span>Profile</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}

                    {!user && (
                        <div className="hidden md:flex items-center space-x-4">
                            <Link to="/login" className="text-slate-600 hover:text-primary transition-colors">
                                Login
                            </Link>
                            <Link to="/signup" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Sign Up
                            </Link>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && user && (
                <div className="md:hidden border-t border-slate-200 bg-white">
                    <div className="px-4 py-4 space-y-3">
                        <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-primary py-2">
                            <Home size={18} />
                            <span>Home</span>
                        </Link>
                        <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-primary py-2">
                            <Building2 size={18} />
                            <span>Offices</span>
                        </Link>
                        {user.role === 'user' && (
                            <Link to="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-primary py-2">
                                <LayoutDashboard size={18} />
                                <span>Dashboard</span>
                            </Link>
                        )}
                        {user.role === 'dept_admin' && (
                            <Link to="/dept-admin" className="flex items-center gap-2 text-slate-600 hover:text-primary py-2">
                                <LayoutDashboard size={18} />
                                <span>Admin Panel</span>
                            </Link>
                        )}
                        {user.role === 'super_admin' && (
                            <Link to="/admin" className="flex items-center gap-2 text-slate-600 hover:text-primary py-2">
                                <LayoutDashboard size={18} />
                                <span>Super Admin</span>
                            </Link>
                        )}
                        <Link to="/profile" className="flex items-center gap-2 text-slate-600 hover:text-primary py-2">
                            <User size={18} />
                            <span>Profile</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-slate-600 hover:text-red-600 py-2 w-full text-left"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}

            {isMenuOpen && !user && (
                <div className="md:hidden border-t border-slate-200 bg-white">
                    <div className="px-4 py-4 space-y-3">
                        <Link to="/login" className="block text-slate-600 hover:text-primary py-2">
                            Login
                        </Link>
                        <Link to="/signup" className="block bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center">
                            Sign Up
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
