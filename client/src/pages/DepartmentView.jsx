import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import useNotifications from '../hooks/useNotifications';
import { Clock, Users, AlertTriangle, Sparkles, Bell } from 'lucide-react';

const DepartmentView = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotifications();
    const [department, setDepartment] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [queueLoading, setQueueLoading] = useState(false);
    const previousTokenRef = useRef(null);

    useEffect(() => {
        // Connect to Socket.IO
        const newSocket = io('http://localhost:5000');

        newSocket.emit('joinRoom', id);

        newSocket.on('queueUpdate', (updatedDept) => {
            setDepartment(updatedDept);

            // Check if user's turn is near (within 3 tokens)
            if (userToken && updatedDept.currentToken >= userToken.token - 3) {
                if (previousTokenRef.current !== updatedDept.currentToken) {
                    setShowAlert(true);
                    showNotification('WaitWise - Your Turn is Near!', {
                        body: `Current token: ${updatedDept.currentToken}. Your token: ${userToken.token}`,
                        tag: 'queue-update'
                    });
                    previousTokenRef.current = updatedDept.currentToken;
                }
            }

            // Refresh AI prediction on update
            fetchPrediction();
        });

        return () => newSocket.close();
    }, [id, userToken]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const deptRes = await axios.get(`/queue/${id}`);
                setDepartment(deptRes.data);
                await fetchPrediction();
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        loadPersistedToken();
    }, [id]);

    const loadPersistedToken = () => {
        const stored = localStorage.getItem(`waitwise_token_${id}`);
        if (stored) {
            try {
                const tokenData = JSON.parse(stored);
                if (tokenData.departmentId === id) {
                    setUserToken(tokenData);
                }
            } catch (err) {
                console.error('Failed to load token from storage');
            }
        }
    };

    const persistToken = (token) => {
        localStorage.setItem(`waitwise_token_${id}`, JSON.stringify({
            ...token,
            departmentId: id,
            savedAt: new Date().toISOString()
        }));
    };

    const fetchPrediction = async () => {
        try {
            const aiRes = await axios.get(`/ai/predict/${id}`);
            setPrediction(aiRes.data);
        } catch (err) {
            console.error("Failed to fetch prediction", err);
        }
    };

    const handleJoinQueue = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setQueueLoading(true);
        try {
            const res = await axios.post(`/queue/${id}/join`);
            const newToken = res.data;
            setUserToken(newToken);
            persistToken(newToken);
            // Refresh department data
            const deptRes = await axios.get(`/queue/${id}`);
            setDepartment(deptRes.data);
            await fetchPrediction();
        } catch (err) {
            console.error("Failed to join queue", err);
        } finally {
            setQueueLoading(false);
        }
    };


    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!department) return <div className="text-center py-10">Department not found</div>;

    const pendingTokens = department.totalTokens - department.currentToken;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Alert Banner */}
            {showAlert && userToken && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg animate-pulse">
                    <div className="flex items-center gap-2 text-green-700">
                        <Bell size={20} />
                        <p className="font-semibold">Your turn is approaching! Current token: {department.currentToken}</p>
                    </div>
                </div>
            )}

            {/* Paused Banner */}
            {department.isPaused && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-orange-700">
                        <AlertTriangle size={20} />
                        <p className="font-semibold">Queue is currently paused. Please wait.</p>
                    </div>
                </div>
            )}

            {/* Header Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">{department.name}</h1>
                <div className="flex justify-center items-center gap-4 text-slate-500 text-sm">
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full ${department.crowdLevel === 'High' ? 'bg-red-100 text-red-700' :
                        department.crowdLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                        }`}>
                        <Users size={16} /> {department.crowdLevel} Crowd
                    </span>
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
                        <p className="text-xs text-green-600 mt-2 font-medium">
                            {userToken.token - department.currentToken} people ahead
                        </p>
                    )}
                </div>
            </div>

            {/* AI Insights */}
            {prediction && (
                <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 p-6 rounded-xl border border-violet-100">
                    <div className="flex items-center gap-2 mb-3 text-violet-700 font-bold">
                        <Sparkles size={20} />
                        <h3>AI Predictions</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                            <p className="text-slate-500">Estimated Wait</p>
                            <p className="text-lg font-semibold text-slate-800">{prediction.estimatedWaitTime} mins</p>
                        </div>
                        <div>
                            <p className="text-slate-500">Tokens Remaining</p>
                            <p className="text-lg font-semibold text-slate-800">{prediction.tokensRemaining}</p>
                        </div>
                    </div>

                    {/* Crowd Forecast */}
                    {prediction.crowdForecast && (
                        <div className="mb-3">
                            <p className="text-slate-600 text-sm font-medium mb-2">Hourly Forecast:</p>
                            <div className="flex gap-2">
                                {prediction.crowdForecast.map((forecast, idx) => (
                                    <div key={idx} className="flex-1 bg-white p-2 rounded text-center">
                                        <p className="text-xs text-slate-500">{forecast.time}</p>
                                        <p className={`text-xs font-semibold ${forecast.level === 'High' ? 'text-red-600' :
                                            forecast.level === 'Medium' ? 'text-yellow-600' :
                                                'text-green-600'
                                            }`}>{forecast.level}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {prediction.alert && (
                        <div className="flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg text-sm">
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
                        disabled={department.isPaused}
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {department.isPaused ? 'Queue Paused' : 'Get Token'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default DepartmentView;
