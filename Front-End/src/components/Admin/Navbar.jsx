import React, { useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };
    const nav = useNavigate()

    const name = localStorage.getItem('adminName')

    return (
        <>
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
                            src="https://th.bing.com/th/id/OIP.8r4KQ83wmwJb7yI9_GjYIgHaHa?rs=1&pid=ImgDetMain"
                            alt="User"
                            className="rounded-full w-10 h-10"
                        />
                        <span>{name}</span>
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-20">
                            <a
                                onClick={() => {
                                    toggleDropdown();
                                    localStorage.clear()
                                    nav('/')
                                }}
                                className="flex items-center px-4 py-2 hover:bg-gray-200"
                            >
                                <FaSignOutAlt className="mr-2" />
                                Logout
                            </a>
                        </div>
                    )}
                </div>
            </nav>
            <Sidebar />
        </>
    );
};

export default Navbar;
