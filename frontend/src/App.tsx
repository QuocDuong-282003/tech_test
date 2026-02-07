import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { path } from './utils/constants';
import OwnerLayout from './layouts/OwnerLayout';
import EmployeeLayout from './layouts/EmployeeLayout';
import Landing from './pages/Landing';

import OwnerLogin from './pages/owner/Login';
import OwnerVerify from './pages/owner/Verify';
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerTasks from './pages/owner/Tasks';
import OwnerChat from './pages/owner/Chat';

import EmployeeLogin from './pages/employee/Login';
import EmployeeVerify from './pages/employee/Verify';
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeChat from './pages/employee/Chat';

function App() {
  return (
    <Router>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>

        <Route path={path.HOME} element={<Landing />} />

        <Route element={<OwnerLayout />}>
          <Route path={path.OWNER_DASHBOARD} element={<OwnerDashboard />} />
          <Route path={path.OWNER_EMPLOYEES} element={<OwnerDashboard />} />
          <Route path={path.OWNER_TASKS} element={<OwnerTasks />} />
          <Route path={path.OWNER_MESSAGES} element={<OwnerChat />} />
        </Route>

        <Route path={path.OWNER_LOGIN} element={<OwnerLogin />} />
        <Route path={path.OWNER_VERIFY} element={<OwnerVerify />} />

        {/*  empl  */}
        <Route element={<EmployeeLayout />}>
          <Route path={path.EMPLOYEE_DASHBOARD} element={<EmployeeDashboard />} />
          <Route path={path.EMPLOYEE_MESSAGES} element={<EmployeeChat />} />
        </Route>

        <Route path={path.EMPLOYEE_LOGIN} element={<EmployeeLogin />} />
        <Route path={path.EMPLOYEE_VERIFY} element={<EmployeeVerify />} />
      </Routes>
    </Router>

  );
}

export default App;
