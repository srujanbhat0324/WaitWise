import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user' // Default to user
    });
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Signup failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Create Account</h2>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role (For Demo)</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    >
                        <option value="user">User</option>
                        <option value="dept_admin">Department Admin</option>
                        <option value="super_admin">Super Admin</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                    Sign Up
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                    Login
                </Link>
            </p>
        </div>
    );
};

export default Signup;
