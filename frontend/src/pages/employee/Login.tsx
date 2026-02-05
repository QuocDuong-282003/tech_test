import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginEmail } from '../../services/auth';

const EmployeeLogin = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginEmail(email);
            localStorage.setItem('temp_email', email);
            navigate('/employee/verify');
        } catch (err: any) {
            alert('Error: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Employee Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="employee@company.com"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                        Next
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EmployeeLogin;
