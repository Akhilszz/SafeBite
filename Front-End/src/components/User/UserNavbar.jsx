import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Menu } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

export const UserNavbar = () => {
    const nav = useNavigate();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

    const image = localStorage.getItem('userImage');
    const name = localStorage.getItem('userName');

    return (
        <nav className="bg-gray-900 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    {/* Mobile Menu Button */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}
                            onClick={toggleMobileMenu}
                        >
                            <span className="sr-only">Open main menu</span>
                            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Logo and Links */}
                    <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex-shrink-0">
                            <a onClick={() => nav('/home')} className="text-2xl font-bold cursor-pointer">SafeBite</a>
                        </div>
                        <div className="hidden sm:flex sm:space-x-6 ml-10">
                            <a onClick={() => nav('/userNoti')} className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Notifications</a>

                            <a onClick={() => nav('/suggetions')} className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Suggestions</a>
                            <a onClick={() => nav('/complaints')} className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Complaints</a>
                        </div>
                    </div>

                    {/* User Profile Dropdown */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <Menu as="div" className="relative">
                            <div>
                                <Menu.Button className="flex items-center text-white rounded-full p-2 focus:outline-none ">
                                    <img
                                        src={`http://localhost:5000/${image}`}
                                        alt="User"
                                        className="rounded-full w-10 h-10 object-cover"
                                    />
                                    <span className="ml-3 hidden md:block">{name}</span>
                                </Menu.Button>

                            </div>
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white text-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="p-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                onClick={() => nav('/userProfile')}
                                                className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                                            >
                                                Your Profile
                                            </a>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() => {
                                                    localStorage.clear();
                                                    nav('/');
                                                }}
                                                className={`block w-full px-4 py-2 text-left text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                                            >
                                                Sign out
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Menu>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`} id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <a onClick={() => nav('/userNoti')} className="text-gray-300 hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">Notifications</a>
                    <a onClick={() => nav('/suggetions')} className="text-gray-300 hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">Suggestions</a>
                    <a onClick={() => nav('/complaints')} className="text-gray-300 hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">Complaints</a>
                </div>
            </div>
        </nav>
    );
};
