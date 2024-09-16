import { useState, useEffect, useContext } from "react";
import { Navigation } from "./Navigation";
import axios from 'axios';
import { mycontext } from "../Context/MyContext";

export const Notification = () => {
    const [type, setType] = useState('restaurant');
    const [hotels, setHotels] = useState([]);
    const [departmentNotifications, setDepartmentNotifications] = useState([]);
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [error, setError] = useState('');
    const [activeNotificationTab, setActiveNotificationTab] = useState('Today'); // Tab for notifications

    const { name, id } = useContext(mycontext);
    const [noid, setID] = useState(id);

    const serverUrl = 'http://localhost:5000';
    const authToken = localStorage.getItem('authTokenOfficer');
    const officerId = localStorage.getItem('officerID');
    const district = localStorage.getItem('officerDistrict');

    useEffect(() => {
        fetchHotel();
        if (type === 'department') {
            fetchDepartmentNotifications();
        }
    }, [type]);

    async function fetchHotel() {
        try {
            const res = await axios.get(`${serverUrl}/api/GetHotel`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (res.data.success) {
                setHotels(res.data.Hotel.filter(hotel =>
                    hotel.address.some(addr => addr.district === district)
                ));
            }
        } catch (err) {
            console.log('fetching error', err);
        }
    }

    async function fetchDepartmentNotifications() {
        try {
            const res = await axios.get(`${serverUrl}/api/getofficer`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (res.data.success) {
                setDepartmentNotifications(res.data.officers.filter(data => data._id === officerId));
            }
        } catch (err) {
            console.log('fetching notifications error', err);
        }
    }

    function handleChange(newType) {
        setType(newType);
        setError(''); // Clear error on type change
    }

    async function handlePublic() {
        setError('');

        // Validation
        if (!title.trim()) {
            setError('Please enter a title.');
            return;
        }
        if (!details.trim()) {
            setError('Please enter notification details.');
            return;
        }

        try {
            const res = await axios.post(`${serverUrl}/api/publicnotification`, {
                title,
                details
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });

            if (res.data.success) {
                alert(res.data.msg);
                setDetails('');
                setTitle('');
            } else {
                alert(res.data.msg);
            }
        } catch (err) {
            console.log('notierror', err);
        }
    }

    async function handleHotel() {
        setError('');

        // Validation
        if (!noid) {
            setError('Please select a hotel.');
            return;
        }
        if (!title.trim()) {
            setError('Please enter a title.');
            return;
        }
        if (!details.trim()) {
            setError('Please enter notification details.');
            return;
        }

        try {
            const res = await axios.post(`${serverUrl}/api/hotelnotification/${noid}`, {
                title: title,
                notification: details
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (res.data.success) {
                alert(res.data.msg);
                setDetails('');
                setID('');
                setTitle('');
            } else {
                alert(res.data.msg);
            }
        } catch (err) {
            console.log('error', err);
        }
    }

    // Helper function to format date to 'YYYY-MM-DD'
    const formatDate = (date) => {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    };

    const todayDate = formatDate(new Date()); // Get today's date

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Navigation />

            <div className="flex-1 p-6 mt-28 ml-44 md:ml-60 max-lg:ml-0">
                {/* Tabs */}
                <div className="relative bg-white shadow-md rounded-lg mb-4">
                    <div className="flex space-x-2 border-b border-gray-300 bg-gray-50 rounded-t-lg">
                        <button
                            className={`py-2 px-4 text-sm font-semibold rounded-t-lg ${type === 'public' ? 'bg-blue-700 text-white border-b-2 border-blue-700' : 'bg-white text-blue-700'}`}
                            onClick={() => handleChange('public')}
                        >
                            Public
                        </button>
                        <button
                            className={`py-2 px-4 text-sm font-semibold rounded-t-lg ${type === 'restaurant' ? 'bg-blue-700 text-white border-b-2 border-blue-700' : 'bg-white text-blue-700'}`}
                            onClick={() => handleChange('restaurant')}
                        >
                            Restaurant
                        </button>
                        <button
                            className={`py-2 px-4 text-sm font-semibold rounded-t-lg ${type === 'department' ? 'bg-blue-700 text-white border-b-2 border-blue-700' : 'bg-white text-blue-700'}`}
                            onClick={() => handleChange('department')}
                        >
                            Department
                        </button>
                    </div>

                    {/* Content Container */}
                    <div className="bg-white shadow-md rounded-b-lg p-6">
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-600 border border-red-300 rounded-md">
                                {error}
                            </div>
                        )}
                        {type === 'public' ? (
                            <div className="flex flex-col space-y-4">
                                <input
                                    type="text"
                                    value={title}
                                    placeholder="Enter title"
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <textarea
                                    value={details}
                                    placeholder="Enter notification details"
                                    onChange={(e) => setDetails(e.target.value)}
                                    className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                    required
                                />
                                <button
                                    onClick={handlePublic}
                                    className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Submit
                                </button>
                            </div>
                        ) : type === 'restaurant' ? (
                            <div className="flex flex-col space-y-4">
                                <select
                                    className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) => setID(e.target.value)}
                                    value={noid}
                                >
                                    <option value="">Select Hotel</option>
                                    {hotels.map(data =>
                                        <option key={data._id} value={data._id}>{data.name}</option>
                                    )}
                                </select>
                                <input
                                    type="text"
                                    value={title}
                                    placeholder="Enter title"
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <textarea
                                    value={details}
                                    placeholder="Enter notification details"
                                    onChange={(e) => setDetails(e.target.value)}
                                    className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                    required
                                />
                                <button
                                    onClick={handleHotel}
                                    className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Submit
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-4">
                                {/* Inner Tabs for Notifications */}
                                <div className="flex space-x-2 border-b border-gray-300 bg-gray-50 rounded-t-lg mb-4">
                                    {['Today', 'Previous'].map(status => (
                                        <button
                                            key={status}
                                            className={`py-2 px-4 text-sm font-semibold rounded-t-lg ${activeNotificationTab === status ? 'bg-blue-700 text-white border-b-2 border-blue-700' : 'bg-white text-blue-700'}`}
                                            onClick={() => setActiveNotificationTab(status)}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>

                                {/* Today and Previous Notifications */}
                                {activeNotificationTab === 'Today' && (
                                    <>
                                        <h3 className="text-lg font-semibold mb-2">Today</h3>
                                        {departmentNotifications.length > 0 && departmentNotifications.some(data =>
                                            data.notification.some(noti => formatDate(noti.date) === todayDate)) ? (
                                            departmentNotifications.map((data, index) => (
                                                data.notification
                                                    .filter(noti => formatDate(noti.date) === todayDate)
                                                    .map((noti, i) => (
                                                        <div key={`${index}-${i}`} className="border p-3 rounded-lg shadow-sm">
                                                            <p className="font-semibold">Title: {noti.title}</p>
                                                            <p>Details: {noti.message}</p>
                                                            <p>Date: {new Date(noti.date).toLocaleDateString()}</p>
                                                        </div>
                                                    ))
                                            ))
                                        ) : (
                                            <p>No notifications for today.</p>
                                        )}
                                    </>
                                )}

                                {activeNotificationTab === 'Previous' && (
                                    <>
                                        <h3 className="text-lg font-semibold mb-2">Previous</h3>
                                        {departmentNotifications.length > 0 && departmentNotifications.some(data =>
                                            data.notification.some(noti => formatDate(noti.date) !== todayDate)) ? (
                                            departmentNotifications.map((data, index) => (
                                                data.notification
                                                    .filter(noti => formatDate(noti.date) !== todayDate)
                                                    .map((noti, i) => (
                                                        <div key={`${index}-${i}`} className="border p-3 rounded-lg shadow-sm">
                                                            <p className="font-semibold">Title: {noti.title}</p>
                                                            <p>Details: {noti.message}</p>
                                                            <p>Date: {new Date(noti.date).toLocaleDateString()}</p>
                                                        </div>
                                                    ))
                                            ))
                                        ) : (
                                            <p>No previous notifications.</p>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
