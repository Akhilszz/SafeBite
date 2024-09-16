import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Nav } from './Nav';

export const HotelNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState('notifications');

    const serverURL = 'https://safe-bite.vercel.app'
    const Email = localStorage.getItem('hotelEmail');

    useEffect(() => {
        fetchHotel();
    }, []);

    async function fetchHotel() {
        try {
            const res = await axios.post(`${serverURL}/api/fetchhotel`, { email: Email });
            if (res.data.success) {
                // Assuming res.data.hotel contains the notifications in a nested array
                // Flatten the notifications array if needed
                const allNotifications = res.data.hotel.flatMap(hotel => hotel.notification || []);
                setNotifications(allNotifications);
            }
        } catch (err) {
            console.log('fetch error', err);
        }
    }

    return (
        <div className="min-h-screen ml-60 bg-gray-100 flex items-start justify-center pt-12 max-md:ml-0">
            <Nav />
            <div className="w-full max-w-3xl p-6 bg-white shadow-md rounded-lg mt-10">
                <div>
                    <div className="flex border-b border-gray-300">
                        <button
                            className={`flex-1 py-2 text-center font-semibold ${activeTab === 'notifications' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setActiveTab('notifications')}
                        >
                            Notifications
                        </button>
                    </div>
                    <div className="p-4">
                        {activeTab === 'notifications' && (
                            <div>
                                {notifications.length > 0 ? (
                                    <ul className="list-none list-inside space-y-2">
                                        {notifications.map((notif) => (
                                            <li key={notif._id} className="p-2 border border-gray-200 rounded-md bg-gray-50">
                                                <p><strong>Title:</strong> {notif.title}</p>
                                                <p><strong>Message:</strong> {notif.message}</p>
                                                <p><strong>Date:</strong> {new Date(notif.date).toLocaleDateString()}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No notifications available.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelNotification;
