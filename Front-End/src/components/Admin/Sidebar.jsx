import React, { useState } from 'react';
import { FaUserTie, FaUsers, FaTasks, FaClipboardCheck, FaComments } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const nav = useNavigate();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative z-50">
            {/* Sidebar */}
            <div
                className={`fixed top-14 left-0 h-screen bg-gray-800 text-white w-44 p-4 flex flex-col space-y-4 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
                <nav className="flex flex-col space-y-2">
                    <a onClick={() => nav('/officer')} className="flex items-center p-2 hover:bg-gray-700 transition duration-300">
                        <FaUserTie className="mr-3" />
                        Inspectors
                    </a>
                    <a onClick={() => nav('/user')} className="flex items-center p-2 hover:bg-gray-700 transition duration-300">
                        <FaUsers className="mr-3" />
                        Users
                    </a>
                    <a onClick={() => nav('/tasks')} className="flex items-center p-2 hover:bg-gray-700 transition duration-300">
                        <FaClipboardCheck className="mr-3" />
                        Tasks
                    </a>
                    <a onClick={() => nav('/permissions')} className="flex items-center p-2 hover:bg-gray-700 transition duration-300">
                        <FaTasks className="mr-3" />
                        Request
                    </a>
                    <a onClick={() => nav('/adminNoti')} className="flex items-center p-2 hover:bg-gray-700 transition duration-300">
                        <FaComments className="mr-3" />
                        Message
                    </a>
                </nav>
                {/* Toggle Button inside Sidebar */}
                {isOpen && (
                    <button
                        className="absolute top-1/2 transform -translate-y-1/2 right-[-12px] focus:outline-none md:hidden"
                        onClick={toggleSidebar}
                    >
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-gray-800 border-l-[8px] border-l-transparent"></div>
                    </button>
                )}
            </div>

            {/* Toggle Button outside Sidebar */}
            {!isOpen && (
                <button
                    className="fixed top-1/2 transform -translate-y-1/2 left-2 focus:outline-none md:hidden"
                    onClick={toggleSidebar}
                >
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-transparent border-l-[8px] border-l-gray-800"></div>
                </button>
            )}
        </div>
    );
};

export default Sidebar;
