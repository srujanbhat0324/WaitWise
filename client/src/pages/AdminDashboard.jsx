import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, MapPin, Building, Users, Save, X } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('offices');
    const [message, setMessage] = useState('');
    const [offices, setOffices] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingOffice, setEditingOffice] = useState(null);
    const [editingDept, setEditingDept] = useState(null);
    const [editingUser, setEditingUser] = useState(null);

    // Office Form State
    const [officeForm, setOfficeForm] = useState({
        name: '', address: '', lat: '', lng: '', type: 'Hospital'
    });

    // Department Form State
    const [deptForm, setDeptForm] = useState({
        name: '', officeId: '', avgWaitTimePerToken: 10
    });

    useEffect(() => {
        if (user?.role === 'super_admin') {
            fetchOffices();
            fetchUsers();
        }
    }, [user]);

    const fetchOffices = async () => {
        try {
            const res = await axios.get('/office');
            setOffices(res.data);
        } catch (err) {
            console.error('Failed to fetch offices');
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/auth/users');
            setUsers(res.data || []);
        } catch (err) {
            console.error('Failed to fetch users');
        }
    };

    if (user?.role !== 'super_admin') {
        return <div className="text-center py-10 text-red-500">Access Denied</div>;
    }

    const handleOfficeSubmit = async (e) => {
        e.preventDefault();
        if (!officeForm.lat || !officeForm.lng) {
            setMessage('Latitude and Longitude are required');
            return;
        }
        try {
            await axios.post('/office', officeForm);
            setMessage('Office created successfully!');
            setOfficeForm({ name: '', address: '', lat: '', lng: '', type: 'Hospital' });
            fetchOffices();
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Failed to create office');
        }
    };

    const handleOfficeUpdate = async (officeId) => {
        try {
            await axios.put(`/office/${officeId}`, editingOffice);
            setMessage('Office updated successfully!');
            setEditingOffice(null);
            fetchOffices();
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Failed to update office');
        }
    };

    const handleOfficeDelete = async (officeId, officeName) => {
        if (!window.confirm(`Are you sure you want to delete "${officeName}"? This will delete all departments in this office.`)) {
            return;
        }
        try {
            await axios.delete(`/office/${officeId}`);
            setMessage('Office deleted successfully!');
            fetchOffices();
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Failed to delete office');
        }
    };

    const handleDeptSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/office/${deptForm.officeId}/departments`, {
                name: deptForm.name,
                avgWaitTimePerToken: deptForm.avgWaitTimePerToken
            });
            setMessage('Department created successfully!');
            setDeptForm({ name: '', officeId: '', avgWaitTimePerToken: 10 });
            fetchOffices();
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Failed to create department');
        }
    };

    const handleDeptUpdate = async (deptId) => {
        try {
            await axios.put(`/department/${deptId}`, editingDept);
            setMessage('Department updated successfully!');
            setEditingDept(null);
            fetchOffices();
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Failed to update department');
        }
    };

    const handleDeptDelete = async (deptId, deptName) => {
        if (!window.confirm(`Are you sure you want to delete "${deptName}"?`)) {
            return;
        }
        try {
            await axios.delete(`/department/${deptId}`);
            setMessage('Department deleted successfully!');
            fetchOffices();
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Failed to delete department');
        }
    };

    const handleUserRoleUpdate = async (userId) => {
        try {
            await axios.put('/auth/update-role', {
                userId,
                role: editingUser.role,
                departmentId: editingUser.departmentId,
                officeId: editingUser.officeId
            });
            setMessage('User role updated successfully!');
            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Failed to update user role');
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Super Admin Dashboard</h1>
                <p className="text-slate-500">Manage offices, departments, and users</p>
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message}
                    <button onClick={() => setMessage('')} className="float-right">
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('offices')}
                        className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === 'offices' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Building className="inline mr-2" size={18} />
                        Manage Offices
                    </button>
                    <button
                        onClick={() => setActiveTab('add-office')}
                        className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === 'add-office' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Plus className="inline mr-2" size={18} />
                        Add Office
                    </button>
                    <button
                        onClick={() => setActiveTab('add-dept')}
                        className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === 'add-dept' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Plus className="inline mr-2" size={18} />
                        Add Department
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === 'users' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Users className="inline mr-2" size={18} />
                        Manage Users
                    </button>
                </div>

                <div className="p-6">
                    {/* Manage Offices Tab */}
                    {activeTab === 'offices' && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">All Offices</h2>
                            {offices.map((office) => (
                                <div key={office._id} className="border border-slate-200 rounded-lg p-4">
                                    {editingOffice?._id === office._id ? (
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={editingOffice.name}
                                                onChange={(e) => setEditingOffice({ ...editingOffice, name: e.target.value })}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                                placeholder="Office Name"
                                            />
                                            <input
                                                type="text"
                                                value={editingOffice.address}
                                                onChange={(e) => setEditingOffice({ ...editingOffice, address: e.target.value })}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                                placeholder="Address"
                                            />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="number"
                                                    step="0.0001"
                                                    value={editingOffice.lat}
                                                    onChange={(e) => setEditingOffice({ ...editingOffice, lat: e.target.value })}
                                                    className="px-3 py-2 border border-slate-300 rounded-lg"
                                                    placeholder="Latitude"
                                                />
                                                <input
                                                    type="number"
                                                    step="0.0001"
                                                    value={editingOffice.lng}
                                                    onChange={(e) => setEditingOffice({ ...editingOffice, lng: e.target.value })}
                                                    className="px-3 py-2 border border-slate-300 rounded-lg"
                                                    placeholder="Longitude"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOfficeUpdate(office._id)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                >
                                                    <Save size={16} />
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingOffice(null)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                                                >
                                                    <X size={16} />
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-bold text-slate-800 text-lg">{office.name}</h3>
                                                    <p className="text-sm text-slate-500">{office.address}</p>
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        <MapPin size={12} className="inline" /> {office.lat}, {office.lng}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setEditingOffice({ ...office })}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleOfficeDelete(office._id, office.name)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            {office.departments && office.departments.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-slate-200">
                                                    <p className="text-sm font-medium text-slate-700 mb-2">Departments:</p>
                                                    <div className="space-y-2">
                                                        {office.departments.map((dept) => (
                                                            <div key={dept._id} className="flex justify-between items-center bg-slate-50 p-2 rounded">
                                                                {editingDept?._id === dept._id ? (
                                                                    <div className="flex-1 flex gap-2">
                                                                        <input
                                                                            type="text"
                                                                            value={editingDept.name}
                                                                            onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                                                                            className="flex-1 px-2 py-1 border border-slate-300 rounded"
                                                                        />
                                                                        <button
                                                                            onClick={() => handleDeptUpdate(dept._id)}
                                                                            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                                                                        >
                                                                            Save
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setEditingDept(null)}
                                                                            className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-sm"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <span className="text-sm text-slate-700">{dept.name}</span>
                                                                        <div className="flex gap-1">
                                                                            <button
                                                                                onClick={() => setEditingDept({ ...dept })}
                                                                                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                                                            >
                                                                                <Edit2 size={14} />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDeptDelete(dept._id, dept.name)}
                                                                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                                                                            >
                                                                                <Trash2 size={14} />
                                                                            </button>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                            {offices.length === 0 && (
                                <div className="text-center py-10 text-slate-500">
                                    <Building size={48} className="mx-auto mb-2 text-slate-300" />
                                    <p>No offices yet. Create one to get started!</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Add Office Tab */}
                    {activeTab === 'add-office' && (
                        <form onSubmit={handleOfficeSubmit} className="space-y-4">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Create New Office</h2>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Office Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={officeForm.name}
                                    onChange={(e) => setOfficeForm({ ...officeForm, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                    placeholder="e.g., City General Hospital"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Address *</label>
                                <input
                                    type="text"
                                    required
                                    value={officeForm.address}
                                    onChange={(e) => setOfficeForm({ ...officeForm, address: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                    placeholder="e.g., 123 Main Street, Downtown"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Latitude *</label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        required
                                        value={officeForm.lat}
                                        onChange={(e) => setOfficeForm({ ...officeForm, lat: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                        placeholder="e.g., 12.9716"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Longitude *</label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        required
                                        value={officeForm.lng}
                                        onChange={(e) => setOfficeForm({ ...officeForm, lng: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                        placeholder="e.g., 77.5946"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Type *</label>
                                <select
                                    value={officeForm.type}
                                    onChange={(e) => setOfficeForm({ ...officeForm, type: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                >
                                    <option value="Hospital">Hospital</option>
                                    <option value="RTO">RTO</option>
                                    <option value="Bank">Bank</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus size={18} />
                                Create Office
                            </button>
                        </form>
                    )}

                    {/* Add Department Tab */}
                    {activeTab === 'add-dept' && (
                        <form onSubmit={handleDeptSubmit} className="space-y-4">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Create New Department</h2>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Select Office *</label>
                                <select
                                    required
                                    value={deptForm.officeId}
                                    onChange={(e) => setDeptForm({ ...deptForm, officeId: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                >
                                    <option value="">-- Select Office --</option>
                                    {offices.map((office) => (
                                        <option key={office._id} value={office._id}>{office.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Department Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={deptForm.name}
                                    onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                    placeholder="e.g., Emergency"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Avg Wait Time (minutes) *</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={deptForm.avgWaitTimePerToken}
                                    onChange={(e) => setDeptForm({ ...deptForm, avgWaitTimePerToken: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus size={18} />
                                Create Department
                            </button>
                        </form>
                    )}

                    {/* Manage Users Tab */}
                    {activeTab === 'users' && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">All Users</h2>
                            <div className="space-y-3">
                                {users.map((u) => (
                                    <div key={u._id} className="border border-slate-200 rounded-lg p-4">
                                        {editingUser?._id === u._id ? (
                                            <div className="space-y-3">
                                                <select
                                                    value={editingUser.role}
                                                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                                >
                                                    <option value="user">User</option>
                                                    <option value="dept_admin">Department Admin</option>
                                                    <option value="super_admin">Super Admin</option>
                                                </select>
                                                {editingUser.role === 'dept_admin' && (
                                                    <>
                                                        <select
                                                            value={editingUser.officeId || ''}
                                                            onChange={(e) => setEditingUser({ ...editingUser, officeId: e.target.value })}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                                        >
                                                            <option value="">Select Office</option>
                                                            {offices.map((office) => (
                                                                <option key={office._id} value={office._id}>{office.name}</option>
                                                            ))}
                                                        </select>
                                                        <select
                                                            value={editingUser.departmentId || ''}
                                                            onChange={(e) => setEditingUser({ ...editingUser, departmentId: e.target.value })}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                                        >
                                                            <option value="">Select Department</option>
                                                            {offices.find(o => o._id === editingUser.officeId)?.departments?.map((dept) => (
                                                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                                                            ))}
                                                        </select>
                                                    </>
                                                )}
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleUserRoleUpdate(u._id)}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingUser(null)}
                                                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium text-slate-800">{u.name}</p>
                                                    <p className="text-sm text-slate-500">{u.email}</p>
                                                    <span className="inline-block mt-1 text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full capitalize">
                                                        {u.role?.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => setEditingUser({ ...u })}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
