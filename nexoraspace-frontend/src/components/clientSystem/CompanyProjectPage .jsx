import React, { useState } from 'react';
import Sidebar from './Sidebar';
import CompanyProject from './CompanyProject';
import EmployeeManagement from './EmployeeManagement';

const CompanyProjectPage = () => {
    const [employees, setEmployees] = useState([]);
    const [projects, setProjects] = useState([]);

    return (
        <div className="flex h-screen bg-gray-900">
            <Sidebar />
            <div className="flex-1 overflow-x-hidden overflow-y-auto">
                <CompanyProject employees={employees} setEmployees={setEmployees} />
            </div>
        </div>
    );
};

export default CompanyProjectPage;