import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, MapPin, User } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">W</div>
                        <span className="text-xl font-bold text-slate-800">WaitWise</span>
                    </Link>

                    <nav className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-sm text-slate-600 hidden sm:block">Hi, {user.name}</span>
                                <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-primary transition-colors">
                                    <LogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="text-sm font-medium text-primary hover:text-blue-600">
                                Login
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
                <Outlet />
            </main>

            <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
                    <p>© 2024 WaitWise. Wait Less, Live More.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
