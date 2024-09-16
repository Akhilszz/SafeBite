import { useState, useEffect, useContext } from "react";
import axios from 'axios';
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { mycontext } from "../Context/MyContext";

export const AdminNotification = () => {
    const [officers, setOfficers] = useState([]);
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [inid, setID] = useState('');
    const [errors, setErrors] = useState({ title: '', details: '', inid: '' }); // State to track errors

    const { id, email, name } = useContext(mycontext);

    const serverUrl = 'https://safe-bite.vercel.app'
    const authToken = localStorage.getItem('authTokenOfficer');

    useEffect(() => {
        fetchOfficers();
    }, []);

    async function fetchOfficers() {
        try {
            const res = await axios.get(`${serverUrl}/api/getofficer`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (res.data.success) {
                setOfficers(res.data.officers);
            }
        } catch (err) {
            console.log('fetching error', err);
        }
    }

    // Validate input fields before submission
    function validateInputs() {
        let isValid = true;
        const newErrors = { title: '', details: '', inid: '' };

        if (!inid) {
            newErrors.inid = 'Please select an inspector';
            isValid = false;
        }
        if (!title.trim()) {
            newErrors.title = 'Title is required';
            isValid = false;
        }
        if (!details.trim()) {
            newErrors.details = 'Details are required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    async function handleNotification() {
        if (!validateInputs()) return; // Check if inputs are valid before submitting

        try {
            const res = await axios.post(`${serverUrl}/api/inspectermessage`, {
                officerId: inid,
                title,
                message: details,
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (res.data.success) {
                alert(res.data.msg);
                setTitle('');
                setDetails('');
                setID('');
                setErrors({ title: '', details: '', inid: '' }); // Reset errors
            } else {
                alert(res.data.msg);
            }
        } catch (err) {
            console.log('error', err);
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Navbar />
            <Sidebar />

            <div className="flex-1 p-6 mt-28 ml-44 md:ml-60 max-lg:ml-0">
                {/* Tabs */}
                <div className="bg-white shadow-md rounded-lg">
                    <button className="py-2 px-4 text-sm font-semibold rounded-t-lg bg-blue-700 text-white border-b-2 border-blue-700">
                        Send Message
                    </button>
                </div>

                {/* Content Container */}
                <div className="bg-white shadow-md rounded-b-lg p-6 mt-[-1px]">
                    <div className="flex flex-col space-y-4">

                        <select
                            className={`p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono ${errors.inid ? 'border-red-500' : ''}`}
                            onChange={(e) => setID(e.target.value)}
                            value={inid || id}
                        >
                            <option value={`${name} | ${email}`}>Select Inspector</option>
                            {officers.map(data => (
                                <option key={data._id} value={data._id}>
                                    {`${data.name} | ${data.email}`}
                                </option>
                            ))}
                        </select>
                        {errors.inid && <p className="text-red-500 text-sm">{errors.inid}</p>}

                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter notification title"
                            required
                            className={`p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : ''}`}
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

                        <textarea
                            value={details}
                            placeholder="Enter inspection details"
                            onChange={(e) => setDetails(e.target.value)}
                            required
                            className={`p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.details ? 'border-red-500' : ''}`}
                            rows="4"
                        />
                        {errors.details && <p className="text-red-500 text-sm">{errors.details}</p>}

                        <button
                            onClick={handleNotification}
                            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
