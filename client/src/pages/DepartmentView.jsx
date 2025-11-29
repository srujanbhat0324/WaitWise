import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Clock, Users, AlertTriangle, Sparkles } from 'lucide-react';

const DepartmentView = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [department, setDepartment] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Connect to Socket.IO
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        newSocket.emit('joinDepartment', id);

        newSocket.on('queueUpdate', (updatedDept) => {
            if (updatedDept._id === id) {
                setDepartment(updatedDept);
            }
        });

        return () => newSocket.close();
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const deptRes = await axios.get(`/queue/${id}`);
                setDepartment(deptRes.data);

                // Fetch AI Prediction
                const aiRes = await axios.get(`/ai/predict/${id}`);
                setPrediction(aiRes.data);
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleJoinQueue = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const res = await axios.post(`/queue/${id}/join`);
            setUserToken(res.data);
            // Refresh department data
            const deptRes = await axios.get(`/queue/${id}`);
            setDepartment(deptRes.data);
        } catch (err) {
            console.error("Failed to join queue", err);
        }
    };

    const handleNextToken = async () => {
        try {
            await axios.put(`/queue/${id}/next`);
            // Socket will update the UI
        } catch (err) {
            console.error("Failed to update token", err);
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!department) return <div className="text-center py-10">Department not found</div>;

    const pendingTokens = department.totalTokens - department.currentToken;
    const estimatedWait = pendingTokens * department.avgWaitTimePerToken;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">{department.name}</h1>
                <div className="flex justify-center items-center gap-4 text-slate-500 text-sm">
                    <span className="flex items-center gap-1"><Users size={16} /> {department.crowdLevel} Crowd</span>
                    <span className="flex items-center gap-1"><Clock size={16} /> ~{department.avgWaitTimePerToken} min/person</span>
                </div>
            </div>

            {/* Live Token Status */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-600 text-white p-6 rounded-xl shadow-md text-center">
                    <p className="text-blue-100 text-sm font-medium uppercase tracking-wider mb-1">Serving Token</p>
                    <h2 className="text-5xl font-bold">{department.currentToken}</h2>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center flex flex-col justify-center">
                    <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Your Token</p>
                    <h2 className="text-4xl font-bold text-slate-800">
                        {userToken ? userToken.token : '-'}
                    </h2>
                    {userToken && (
                        <p className="text-xs text-green-600 mt-2 font-medium">You are in queue</p>
                    )}
                </div>
            </div>

            {/* AI Insights */}
            {prediction && (
                <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 p-6 rounded-xl border border-violet-100">
                    <div className="flex items-center gap-2 mb-3 text-violet-700 font-bold">
                        <Sparkles size={20} />
                        <h3>Antigravity AI Insights</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-slate-500">Estimated Wait</p>
                            <p className="text-lg font-semibold text-slate-800">{prediction.estimatedWaitTime} mins</p>
                        </div>
                        <div>
                            <p className="text-slate-500">Peak Time</p>
                            <p className="text-lg font-semibold text-slate-800">{prediction.peakTime}</p>
                        </div>
                    </div>
                    {prediction.alert && (
                        <div className="mt-4 flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg text-sm">
                            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                            <p>{prediction.alert}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
                {!userToken && (
                    <button
                        onClick={handleJoinQueue}
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all transform active:scale-95"
                    >
                        Get Token
                    </button>
                )}

                {/* Admin Controls */}
                {(user?.role === 'dept_admin' || user?.role === 'super_admin') && (
                    <div className="bg-slate-100 p-4 rounded-xl mt-6">
                        <h3 className="font-bold text-slate-700 mb-3">Admin Controls</h3>
                        <button
                            onClick={handleNextToken}
                            className="w-full bg-slate-800 text-white py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
                        >
                            Call Next Token
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DepartmentView;
