import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';

const EmployeeVerify = () => {
    const [code, setCode] = useState('');
    const navigate = useNavigate();
    const email = localStorage.getItem('temp_email');

    useEffect(() => {
        if (!email) navigate('/employee/login');
    }, [email, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/employee/ValidateAccessCode', { email, accessCode: code });
            if (res.data.success) {
                localStorage.setItem('employee_auth', 'true');
                localStorage.setItem('employee_id', res.data.employee.id);
                localStorage.setItem('employee_data', JSON.stringify(res.data.employee));
                navigate('/employee/dashboard');
            }
        } catch (err: any) {
            alert('Error: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Verify Identity</h2>
                <p className="text-gray-600 mb-4 text-center">Enter code sent to {email}</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-xl tracking-widest"
                            placeholder="XXXXXX"
                            maxLength={6}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EmployeeVerify;
