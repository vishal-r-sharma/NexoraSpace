import React from 'react';
import Sidebar from './Sidebar';
import EmployeeManagement from './EmployeeManagement';

const EmployeePage = () => {
    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            <Sidebar />
            <main className="flex-1 p-6">
                <EmployeeManagement />
            </main>
        </div>
    );
};

export default EmployeePage;
