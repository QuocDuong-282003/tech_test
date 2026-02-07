import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 space-x-4">
            <Link
                to="/owner/login"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
            >
                Owner Portal
            </Link>
            <Link
                to="/employee/login"
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors duration-200"
            >
                Employee Portal
            </Link>
        </div>
    );
};

export default Landing;
