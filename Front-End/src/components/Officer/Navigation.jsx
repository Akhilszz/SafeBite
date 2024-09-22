import React, { useState } from 'react';
import { FaSignOutAlt, FaEnvelope, FaBell, FaClipboardCheck, FaUserTimes, FaStar, FaTasks, FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const Navigation = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const nav = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleNavigation = (path) => {
        nav(path);
        setSidebarOpen(false); // Close sidebar on navigation
    };

    const name = localStorage.getItem('officerName');
    const image = localStorage.getItem('officerImage');

    return (
        <div className="relative">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 bg-gray-800 text-white px-4 py-2 flex justify-between items-center z-10 shadow-md">
                {/* Logo */}
                <div className="text-2xl font-bold ml-6">
                    <a href="/">SafeBite</a>
                </div>

                {/* User Profile */}
                <div className="relative">
                    <button
                        className="flex items-center mr-3 space-x-3"
                        onClick={toggleDropdown}
                    >
                        <img
                            src={image}
                            alt="User"
                            className="rounded-full w-10 h-10"
                        />
                        <span>{name}</span>
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-20">
                            <a
                                href="#logout"
                                onClick={() => {
                                    toggleDropdown();
                                    localStorage.clear();
                                    nav('/');
                                }}
                                className="flex items-center px-4 py-2 hover:bg-gray-200"
                            >
                                <FaSignOutAlt className="mr-2" />
                                Logout
                            </a>
                        </div>
                    )}
                </div>

                {/* Sidebar Toggle Button */}
                <button
                    className="md:hidden fixed top-1/2 transform -translate-y-1/2 left-2 focus:outline-none"
                    onClick={toggleSidebar}
                >
                    <div className={`w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ${sidebarOpen ? 'border-r-[8px] border-r-gray-800' : 'border-r-[8px] border-r-transparent'} border-l-[8px] border-l-gray-800`}></div>
                </button>
            </nav>

            {/* Sidebar */}
            <div
                className={`fixed top-14 border-t-2 left-0 h-screen bg-gray-800 text-white w-60 p-4 flex flex-col space-y-4 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-50`}
            >
                <nav className="flex flex-col space-y-2">
                    <a onClick={() => handleNavigation('/requests')} className="flex items-center p-2 hover:bg-gray-700 transition duration-300">
                        <FaEnvelope className="mr-3" />
                        Requests
                    </a>
                    <a onClick={() => handleNavigation('/notification')} className="flex items-center p-2 hover:bg-gray-700 transition duration-300">
                        <FaBell className="mr-3" />
                        Notifications
                    </a>
                    <a onClick={() => handleNavigation('/inspection')} className="flex items-center p-2 hover:bg-gray-700 transition duration-300">
                        <FaClipboardCheck className="mr-3" />
                        Inspection
                    </a>
                    <a onClick={() => handleNavigation('/blacklist')} className="flex items-center p-2 hover:bg-gray-700 transition duration-300">
                        <FaUserTimes className="mr-3" />
                        Blacklists
                    </a>
                    <a onClick={() => handleNavigation('/rating')} className="flex items-center p-2 hover:bg-gray-700 transition duration-300">
                        <FaStar className="mr-3" />
                        Grade
                    </a>
                    <a onClick={() => handleNavigation('/action')} className="flex items-center p-2 hover:bg-gray-700 transition duration-300">
                        <FaTasks className="mr-3" />
                        Action
                    </a>
                    <a onClick={() => handleNavigation('/officerFeedback')} className="flex items-center p-2 hover:bg-gray-700 transition duration-300">
                        <FaExclamationCircle className="mr-3" />
                        Complaints
                    </a>
                </nav>

                {/* Toggle Button inside Sidebar */}
                {sidebarOpen && (
                    <button
                        className="absolute top-1/2 transform -translate-y-1/2 right-[-12px] focus:outline-none md:hidden"
                        onClick={toggleSidebar}
                    >
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-gray-800 border-l-[8px] border-l-transparent"></div>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Navigation;
