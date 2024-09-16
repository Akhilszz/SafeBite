import { useContext, useEffect, useState } from "react";
import { Nav } from "./Nav";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { mycontext } from "../Context/MyContext";

export const HotelMain = () => {
    const [hotel, setHotel] = useState([]);
    const [editHotel, setEditHotel] = useState(null); // State to store the hotel being edited
    const [formData, setFormData] = useState({}); // Form data for editing
    const [selectedImage, setSelectedImage] = useState(null); // State to handle selected image

    const serverURL = 'http://localhost:5000';
    const Email = localStorage.getItem('hotelEmail');

    const { setAmount, setId } = useContext(mycontext);

    const nav = useNavigate();

    useEffect(() => {
        fetchHotel();
    }, []);

    async function fetchHotel() {
        try {
            const res = await axios.post(`${serverURL}/api/fetchhotel`, { email: Email });
            if (res.data.success) {
                setHotel(res.data.hotel);
            }
            console.log(res.data.msg);
        } catch (err) {
            console.log('fetch error', err);
        }
    }

    function handlePay(id, amount) {
        setId(id);
        setAmount(amount);
        nav('/payment');
    }

    function handleEdit(hotel) {
        setEditHotel(hotel);
        setFormData({
            image: hotel.image,
            name: hotel.name,
            address: {
                state: hotel.address[0].state,
                city: hotel.address[0].city,
                pincode: hotel.address[0].pincode,
                district: hotel.address[0].district,
                phone: hotel.address[0].phone
            }
        });
        setSelectedImage(null); // Reset selected image when editing
    }

    async function handleSave() {
        const address = [{
            state: formData.address.state,
            city: formData.address.city,
            pincode: formData.address.pincode,
            district: formData.address.district,
            phone: formData.address.phone
        }];

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('address', JSON.stringify(address)); // Append address as a JSON string
        if (selectedImage) {
            formDataToSend.append('image', selectedImage); // Append selected image
        }

        try {
            const res = await axios.put(`${serverURL}/api/updatehotel/${editHotel._id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Ensure form data is handled properly
                }
            });
            if (res.data.success) {
                fetchHotel(); // Refresh the hotel data after updating
                setEditHotel(null); // Close the edit form after success
            }
        } catch (err) {
            console.log('Update error', err);
        }
    }

    function handleImageChange(event) {
        if (event.target.files.length > 0) {
            setSelectedImage(event.target.files[0]); // Set selected image
        }
    }

    return (
        <div>
            <Nav />
            <div className="overflow-x-auto ml-64 mt-20 mr-10 max-md:ml-4">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Image</th>
                            <th className="py-2 px-4 border-b">Licence</th>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Location</th>
                            <th className="py-2 px-4 border-b">Phone</th>
                            <th className="py-2 px-4 border-b">Grade</th>
                            <th className="py-2 px-4 border-b">Penalty</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hotel.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="py-4 text-center text-gray-500">No hotels available.</td>
                            </tr>
                        ) : (
                            hotel.map(data => (
                                <tr key={data._id}>
                                    <td className="py-2 px-4 border-b">
                                        <img src={`http://localhost:5000/${data.image}`} alt={data.name} className="w-16 h-16 object-cover rounded-full" />
                                    </td>
                                    <td className="py-2 px-4 border-b">{data.liceno}</td>
                                    <td className="py-2 px-4 border-b">{data.name}</td>
                                    <td className="py-2 px-4 border-b">
                                        {data.address.map((addr, index) => (
                                            <div key={index}>
                                                <p>{addr.city.toUpperCase()}, {addr.district.toUpperCase()}, {addr.state.toUpperCase()}, {addr.pincode.toUpperCase()}</p>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {data.address.map((addr, index) => (
                                            <div key={index}>
                                                <p>{addr.phone}</p>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-2 px-4 border-b">{data.rating}</td>
                                    <td className="py-2 px-4 border-b">₹{data.penalty}</td>
                                    <td className="py-2 px-4 border-b">
                                        <div className="flex space-x-2">
                                            {data.penalty > 0 && (
                                                <button
                                                    onClick={() => handlePay(data._id, data.penalty)}
                                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                                >
                                                    Pay
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleEdit(data)}
                                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Edit form */}
                {editHotel && (
                    <div className="mt-8 p-4 bg-gray-100 rounded">
                        <h2 className="text-xl font-bold mb-4">Edit Hotel</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700">Name:</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Phone:</label>
                            <input
                                type="text"
                                value={formData.address.phone}
                                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, phone: e.target.value } })}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">City:</label>
                            <input
                                type="text"
                                value={formData.address.city}
                                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">State:</label>
                            <input
                                type="text"
                                value={formData.address.state}
                                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">District:</label>
                            <input
                                type="text"
                                value={formData.address.district}
                                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, district: e.target.value } })}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Pincode:</label>
                            <input
                                type="text"
                                value={formData.address.pincode}
                                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, pincode: e.target.value } })}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Image:</label>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                            {selectedImage && (
                                <div className="mt-2">
                                    <p>Selected Image:</p>
                                    <img src={URL.createObjectURL(selectedImage)} alt="Selected" className="w-32 h-32 object-cover" />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleSave}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setEditHotel(null)}
                            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
