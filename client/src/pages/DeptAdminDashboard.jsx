import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';
import { Play, Pause, SkipForward, SkipBack, Hash, Users, Clock } from 'lucide-react';

const DeptAdminDashboard = () => {
    const { user } = useAuth();
    const [department, setDepartment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [manualToken, setManualToken] = useState('');
    const [analytics, setAnalytics] = useState(null);
    const [editingAvgTime, setEditingAvgTime] = useState(false);
    const [newAvgTime, setNewAvgTime] = useState('');

    useEffect(() => {
        if (!user?.departmentId) {
            setError('No department assigned to this admin');
            setLoading(false);
            return;
        }

        fetchDepartment();

        // Socket.io connection
        const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
        socket.emit('joinRoom', user.departmentId);

        socket.on('queueUpdate', (updatedDept) => {
            setDepartment(updatedDept);
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

    const fetchDepartment = async () => {
        try {
            const res = await axios.get(`/queue/${user.departmentId}`);
            setDepartment(res.data);
            fetchAnalytics();
        } catch (err) {
            setError('Failed to load department data');
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const res = await axios.get(`/department/${user.departmentId}/analytics`);
            setAnalytics(res.data);
        } catch (err) {
            console.error('Failed to load analytics');
        }
    };

    const handleNext = async () => {
        try {
            const res = await axios.put(`/queue/${user.departmentId}/next`);
            setDepartment(res.data);
            setMessage('Token updated successfully');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to update token');
        }
    };

    const handlePrevious = async () => {
        try {
            const res = await axios.put(`/queue/${user.departmentId}/previous`);
            setDepartment(res.data);
            setMessage('Token updated successfully');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to update token');
        }
    };

    const handleSetToken = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`/queue/${user.departmentId}/set`, {
                tokenNumber: parseInt(manualToken)
            });
            setDepartment(res.data);
            setManualToken('');
            setMessage('Token set successfully');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to set token');
        }
    };

    const handleTogglePause = async () => {
        if (!window.confirm(`Are you sure you want to ${department.isPaused ? 'resume' : 'pause'} the queue?`)) {
            return;
        }
        try {
            const res = await axios.put(`/queue/${user.departmentId}/toggle-pause`);
            setDepartment(res.data);
            setMessage(res.data.isPaused ? 'Queue paused' : 'Queue resumed');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError('Failed to toggle pause');
        }
    };

    const handleUpdateAvgTime = async () => {
        try {
            const res = await axios.put(`/department/${user.departmentId}/avg-time`, {
                avgWaitTimePerToken: parseInt(newAvgTime)
            });
            setDepartment(res.data);
            setEditingAvgTime(false);
            setMessage('Average time updated successfully');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError('Failed to update average time');
        }
    };

    if (user?.role !== 'dept_admin') {
        return <div className="text-center py-10 text-red-500">Access Denied - Department Admin Only</div>;
    }

    if (loading) {
        return <div className="text-center py-10">Loading department data...</div>;
    }

    if (error && !department) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    const tokensRemaining = department.totalTokens - department.currentToken;
    const estimatedWaitTime = tokensRemaining * department.avgWaitTimePerToken;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Department Admin Dashboard</h1>
                <p className="text-slate-500">Managing: <span className="font-semibold text-slate-700">{department?.name}</span></p>
            </div>

            {message && (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg">
                    {message}
                </div>
            )}

            {error && department && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-sm">Current Token</span>
                        <Hash className="text-primary" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{department?.currentToken}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-sm">Total Tokens</span>
                        <Users className="text-primary" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{department?.totalTokens}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-sm">Remaining</span>
                        <Clock className="text-primary" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{tokensRemaining}</p>
                    <p className="text-xs text-slate-500 mt-1">~{estimatedWaitTime} mins wait</p>
                </div>
            </div>

            {/* Token Controls */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Token Controls</h2>

                <div className="flex flex-wrap gap-4 mb-6">
                    <button
                        onClick={handlePrevious}
                        disabled={department?.currentToken <= 0}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <SkipBack size={20} />
                        Previous
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={department?.currentToken >= department?.totalTokens}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <SkipForward size={20} />
                        Next Token
                    </button>

                    <button
                        onClick={handleTogglePause}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${department?.isPaused
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                            }`}
                    >
                        {department?.isPaused ? (
                            <>
                                <Play size={20} />
                                Resume Queue
                            </>
                        ) : (
                            <>
                                <Pause size={20} />
                                Pause Queue
                            </>
                        )}
                    </button>
                </div>

                {/* Manual Token Setter */}
                <form onSubmit={handleSetToken} className="flex gap-4">
                    <input
                        type="number"
                        value={manualToken}
                        onChange={(e) => setManualToken(e.target.value)}
                        placeholder="Set token number manually"
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary"
                        min="0"
                        max={department?.totalTokens}
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                    >
                        Set Token
                    </button>
                </form>
            </div>

            {/* Queue Status */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Queue Status</h2>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-600">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${department?.isPaused
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                            }`}>
                            {department?.isPaused ? 'Paused' : 'Active'}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-slate-600">Crowd Level:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${department?.crowdLevel === 'High'
                            ? 'bg-red-100 text-red-700'
                            : department?.crowdLevel === 'Medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                            {department?.crowdLevel}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-slate-600">Avg Wait Time:</span>
                        {editingAvgTime ? (
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={newAvgTime}
                                    onChange={(e) => setNewAvgTime(e.target.value)}
                                    className="w-20 px-2 py-1 border border-slate-300 rounded"
                                    min="1"
                                />
                                <button
                                    onClick={handleUpdateAvgTime}
                                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingAvgTime(false)}
                                    className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-sm hover:bg-slate-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-800">{department?.avgWaitTimePerToken} mins/token</span>
                                <button
                                    onClick={() => {
                                        setEditingAvgTime(true);
                                        setNewAvgTime(department?.avgWaitTimePerToken);
                                    }}
                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-slate-600">Last Updated:</span>
                        <span className="text-slate-500 text-sm">
                            {new Date(department?.lastUpdated).toLocaleTimeString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Analytics Panel */}
            {analytics && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Today's Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-600 mb-1">Tokens Served</p>
                            <p className="text-2xl font-bold text-blue-700">{analytics.tokensServedToday}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-600 mb-1">Completed</p>
                            <p className="text-2xl font-bold text-green-700">{analytics.tokensCompletedToday}</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <p className="text-sm text-purple-600 mb-1">Avg Processing Time</p>
                            <p className="text-2xl font-bold text-purple-700">{analytics.avgProcessingTime} min</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeptAdminDashboard;
