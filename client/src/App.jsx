import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OfficeView from './pages/OfficeView';
import DepartmentView from './pages/DepartmentView';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                        <Route path="office/:id" element={<OfficeView />} />
                        <Route path="department/:id" element={<DepartmentView />} />
                        <Route path="admin" element={<AdminDashboard />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
