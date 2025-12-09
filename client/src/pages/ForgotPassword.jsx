import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [resetToken, setResetToken] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await axios.post('/auth/forgot-password', { email });
            setMessage(res.data.msg);
            setResetToken(res.data.resetToken);
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                    <Link to="/login" className="flex items-center gap-2 text-slate-600 hover:text-primary mb-6">
                        <ArrowLeft size={18} />
                        <span>Back to Login</span>
                    </Link>

                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Forgot Password?</h1>
                    <p className="text-slate-500 mb-6">Enter your email to receive a password reset link</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Mail size={16} />
                                    <span>Email Address</span>
                                </div>
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="your@email.com"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            />
                        </div>

                        {message && (
                            <div className={`p-3 rounded-lg ${message.includes('generated') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message}
                            </div>
                        )}

                        {resetToken && (
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800 mb-2">Reset Link:</p>
                                <Link
                                    to={`/reset-password/${resetToken}`}
                                    className="text-primary hover:underline text-sm break-all"
                                >
                                    {window.location.origin}/reset-password/{resetToken}
                                </Link>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
