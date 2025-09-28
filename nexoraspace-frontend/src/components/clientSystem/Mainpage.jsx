import React from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';

const Mainpage = () => {
    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            <Sidebar />
            <div className="flex-1 lg:ml-0 min-h-screen overflow-auto">
                <Dashboard />
            </div>
        </div>
    );
};

export default Mainpage;