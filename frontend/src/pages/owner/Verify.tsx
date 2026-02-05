import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateOwnerAccessCode } from '../../services/auth';

const OwnerVerify = () => {
    const [code, setCode] = useState('');
    const navigate = useNavigate();
    const phone = localStorage.getItem('temp_phone');

    useEffect(() => {
        if (!phone) navigate('/owner/login');
    }, [phone, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await validateOwnerAccessCode(phone!, code);
            if (res.data.success) {
                // Step 3: validate code, save phone to local storage (already done, but maybe mark as auth?)
                localStorage.setItem('owner_auth', 'true'); // Simple auth flag
                localStorage.setItem('owner_phone', phone || '');
                navigate('/owner/dashboard');
            }
        } catch (err: any) {
            alert('Error: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Phone Verification</h2>
                <p className="text-gray-600 mb-4 text-center">Enter the code sent to {phone}</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl tracking-widest"
                            placeholder="XXXXXX"
                            maxLength={6}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OwnerVerify;
