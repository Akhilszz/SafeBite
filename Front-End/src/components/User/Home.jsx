import { useEffect, useState } from "react";
import { UserNavbar } from "./UserNavbar";
import axios from 'axios';

export const Home = () => {
    const [hotels, setHotels] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [locationDetails, setLocationDetails] = useState(null);

    const serverURL = 'https://safe-bite.vercel.app'

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    fetchLocationDetails(coords.latitude, coords.longitude);
                },
                (error) => {
                    console.error("Error fetching location: ", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    const fetchLocationDetails = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
            );
            const data = await response.json();
            console.log(data); // Log the entire response object

            if (data.address) {
                setLocationDetails(data.address);
            } else {
                console.error("No address found for the given coordinates.");
            }
        } catch (error) {
            console.error("Error fetching location details: ", error);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    async function fetchHotels() {
        try {
            const res = await axios.get(`${serverURL}/api/GetHotel`);

            if (res.data.success) {
                setHotels(res.data.Hotel.filter(data => data.status === 'generated'));
            } else {
                console.log(res.data.msg);
            }
        } catch (err) {
            console.log('fetch error', err);
        }
    }

    // Filter function for "Near Me" tab
    const filterNearbyHotels = (hotel) => {
        if (locationDetails && hotel.address) {
            return hotel.address.some(addr =>
                addr.city.toLowerCase() === locationDetails.county.toLowerCase() ||
                addr.district.toLowerCase() === locationDetails.state_district.toLowerCase()
            );
        }
        return false;
    };

    const filteredHotels = activeTab === 'all'
        ? hotels
        : hotels.filter(filterNearbyHotels);

    return (
        <div>
            <UserNavbar />
            <div className="p-6">
                {/* Tabs */}
                <div className="flex space-x-4 mb-6">
                    <button
                        className={`py-2 px-4 text-sm font-semibold ${activeTab === 'all' ? 'border-b-2 border-blue-700 text-blue-700' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All
                    </button>
                    <button
                        className={`py-2 px-4 text-sm font-semibold ${activeTab === 'near' ? 'border-b-2 border-blue-700 text-blue-700' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('near')}
                    >
                        Near Me
                    </button>
                </div>

                {/* Hotels Flex Container */}
                <div className="flex flex-wrap gap-4 max-md:justify-center">
                    {filteredHotels.length === 0 ? (
                        <p className="w-full text-center text-gray-500">No hotels available.</p>
                    ) : (
                        filteredHotels.map(data => (
                            <div
                                key={data._id}
                                className="bg-black text-white shadow-md rounded-lg overflow-hidden"
                                style={{ width: '100%', maxWidth: '280px' }} // Adjust card size
                            >
                                <img
                                    src={`https://safe-bite.vercel.app/${data.image}`}
                                    alt={data.name}
                                    className="w-full h-36 object-cover"
                                />
                                <div className="p-3">
                                    <h2 className="text-lg font-semibold">
                                        {data.name}
                                    </h2>
                                    <div className="text-sm mt-1">
                                        <h3 className="font-semibold">Location:</h3>
                                        {data.address.map((addr, index) => (
                                            <div key={index} className="mb-2">
                                                <p>
                                                    {addr.city.toUpperCase()}, {addr.district.toUpperCase()}, {addr.state.toUpperCase()}, {addr.pincode.toUpperCase()}
                                                </p>
                                                <p><strong>Phone:</strong> {addr.phone}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-yellow-500 mt-2">
                                        Grade: {data.rating}
                                    </p>
                                    {data.blacklist && (
                                        <div className="mt-2 p-2 bg-red-600 text-white rounded">
                                            Blacklisted
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
