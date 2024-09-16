import { useEffect, useState } from "react";
import axios from 'axios';
import { UserNavbar } from "./UserNavbar";

export const Complaints = () => {
    const [hotels, setHotels] = useState([]);
    const [complaint, setComplaint] = useState('');
    const [selectedHotelId, setSelectedHotelId] = useState('');
    const [proof, setProof] = useState(''); // State to handle the uploaded image

    const serverURL = 'http://localhost:5000';
    const userID = localStorage.getItem('userID');

    useEffect(() => {
        fetchHotels();
    }, []);

    async function fetchHotels() {
        try {
            const res = await axios.get(`${serverURL}/api/GetHotel`);
            if (res.data.success) {
                setHotels(res.data.Hotel.filter(data => data.status === 'generated' && !data.blacklist));
            } else {
                alert(res.data.msg);
            }
        } catch (err) {
            console.log('fetch error', err);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!proof) {
            alert('Proof is required to submit the complaint.');
            return;
        }

        const formData = new FormData(); // Use FormData to handle file uploads
        formData.append('userId', userID);
        formData.append('hotelId', selectedHotelId);
        formData.append('complaint', complaint);
        formData.append('proof', proof); // Attach the proof image

        try {
            const res = await axios.post(`${serverURL}/api/sendComplaint`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.success) {
                alert('Complaint registered successfully');
                setComplaint('');
                setSelectedHotelId('');
                setProof(''); // Clear the file input
            } else {
                alert('Something went wrong');
            }
        } catch (err) {
            console.log('submit error', err);
        }
    }

    return (
        <div>
            <UserNavbar />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Submit a Complaint</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="hotel" className="block text-lg font-medium text-gray-700 mb-2">Select Hotel</label>
                            <select
                                id="hotel"
                                value={selectedHotelId}
                                onChange={(e) => setSelectedHotelId(e.target.value)}
                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white"
                            >
                                <option value="" disabled>Select a hotel</option>
                                {hotels.map(hotel => (
                                    <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="complaint" className="block text-lg font-medium text-gray-700 mb-2">Complaint</label>
                            <textarea
                                id="complaint"
                                value={complaint}
                                onChange={(e) => setComplaint(e.target.value)}
                                placeholder="Enter your complaint here..."
                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 bg-white"
                                rows="6"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="proof" className="block text-lg font-medium text-gray-700 mb-2">Proof (Required)</label>
                            <input
                                id="proof"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setProof(e.target.files[0])}
                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Submit
                        </button>
                    </form>
                    <p className="mt-6 text-gray-600 text-sm">
                        Please ensure that the proof you upload is significant to your complaint. All complaints are also reviewed by the respective district inspector.
                    </p>
                </div>
            </div>
        </div>
    );
};
