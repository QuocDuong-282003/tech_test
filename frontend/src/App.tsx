import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OwnerLayout from './layouts/OwnerLayout';
import OwnerLogin from './pages/owner/Login';
import OwnerVerify from './pages/owner/Verify';
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerTasks from './pages/owner/Tasks';
import OwnerChat from './pages/owner/Chat';
import EmployeeLogin from './pages/employee/Login';
import EmployeeVerify from './pages/employee/Verify';
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeLayout from './layouts/EmployeeLayout';
import EmployeeChat from './pages/employee/Chat';

const Landing = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 space-x-4">
    <a href="/owner/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">Owner Portal</a>
    <a href="/employee/login" className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">Employee Portal</a>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />

        {/* Owner Routes */}
        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route path="/owner/verify" element={<OwnerVerify />} />

        <Route element={<OwnerLayout />}>
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/employees" element={<OwnerDashboard />} />
          <Route path="/owner/tasks" element={<OwnerTasks />} />
          <Route path="/owner/messages" element={<OwnerChat />} />
        </Route>



        {/* Employee Routes */}
        <Route path="/employee/login" element={<EmployeeLogin />} />
        <Route path="/employee/verify" element={<EmployeeVerify />} />

        <Route element={<EmployeeLayout />}>
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/messages" element={<EmployeeChat />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
