import Sidebar from './Sidebar';
import CompanySetting from './CompanySetting';
import React from 'react';

const CompanySettingPage = () => {
    return (
        <div className="flex min-h-screen bg-gray-900">
            <Sidebar />
            <div className="flex-1 p-8">
                <CompanySetting />
            </div>
        </div>
    );
};

export default CompanySettingPage;