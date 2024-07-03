import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Logique de déconnexion
        navigate('/login');
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#252C40] text-white">
            <div className="flex justify-between items-center p-4">
                <img src="../logo.svg" alt="Teki Logo" className="w-36" />
                <button
                    onClick={handleLogout}
                    className="bg-[#E6F0FF] font-bold text-gray-800 px-4 py-2 rounded hover:bg-blue-200 transition duration-300"
                >
                    Logout
                </button>
            </div>
            <div className="flex-grow p-10">
                <h1 className="text-5xl font-bold mb-2">Hello John Doe</h1>
                <p className="text-gray-400 mb-12">Gérez vos services depuis cette interface sécurisée</p>
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gray-700 rounded-lg p-4 h-32"></div>
                    <div className="bg-gray-700 rounded-lg p-4 h-32"></div>
                    <div className="bg-gray-700 rounded-lg p-4 h-32"></div>
                    <div className="bg-gray-700 rounded-lg p-4 h-32"></div>
                    <div className="col-span-2 bg-gray-700 rounded-lg p-4 h-64"></div>
                    <div className="col-span-2 bg-gray-700 rounded-lg p-4 h-64"></div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
