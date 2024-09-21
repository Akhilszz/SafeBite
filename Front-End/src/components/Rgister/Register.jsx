import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const Register = () => {
    const nav = useNavigate();
    const serverUrl = 'https://safe-bite.vercel.app'

    const [userType, setUserType] = useState("User");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [profileUrl, setProfileUrl] = useState(""); // Updated to profileUrl instead of file
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [pincode, setPincode] = useState("");
    const [district, setDistrict] = useState("");
    const [phone, setPhone] = useState("");  // New state for phone number
    const [error, setError] = useState("");

    async function submit(event) {
        event.preventDefault();

        const formData = {
            name,
            email,
            password: pass,
            image: profileUrl, // Using profileUrl for profile image as a URL
        };

        if (userType === "Restaurant") {
            const address = [{
                state: state,
                city: city,
                pincode: pincode,
                district: district,
                phone: phone  // Add phone number to address
            }];

            formData.address = JSON.stringify(address)
        }

        try {
            const res = await axios.post(`${serverUrl}/api/register/${userType}`, formData);
            if (res.data.success) {
                console.log(res.data);
                nav('/');
            } else {
                setError(res.data.msg);
            }
        } catch (err) {
            console.error(`register ${userType} error`, err);
        }

        // Clear form fields
        setUserType("User");
        setName("");
        setEmail("");
        setPass("");
        setProfileUrl(""); // Clear profile URL
        setState("");
        setCity("");
        setPincode("");
        setDistrict("");
        setPhone("");  // Clear phone number
    }

    function Login() {
        nav('/');
    }

    return (
        <div className="flex justify-center items-center h-full bg-gray-100">
            <form className="bg-white p-6 rounded shadow-md w-96 m-8" onSubmit={submit}>
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
                <div className="mb-4">
                    <label className="block text-gray-700">Register as</label>
                    <select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    >
                        <option value="User">User</option>
                        <option value="Restaurant">Restaurant</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        value={name}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        required
                        pattern="[a-zA-Z\s]+"
                        title="only alphabets and spaces allowed"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        required
                        pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                        value={email}
                    />
                </div>
                {userType === "Restaurant" && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700">State</label>
                            <input
                                onChange={(e) => setState(e.target.value)}
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required={userType === "Restaurant"}
                                pattern="[a-zA-Z\s]+"
                                title="only alphabets and spaces allowed"
                                value={state}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">City</label>
                            <input
                                onChange={(e) => setCity(e.target.value)}
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required={userType === "Restaurant"}
                                pattern="[a-zA-Z\s]+"
                                title="only alphabets and spaces allowed"
                                value={city}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Pincode</label>
                            <input
                                onChange={(e) => setPincode(e.target.value)}
                                type="number"
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required={userType === "Restaurant"}
                                pattern="[9876543210][0-9]{9}"
                                title="only numbers allowed"
                                value={pincode}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">District</label>
                            <input
                                onChange={(e) => setDistrict(e.target.value)}
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required={userType === "Restaurant"}
                                pattern="[a-zA-Z\s]+"
                                title="only alphabets and spaces allowed"
                                value={district}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700">Phone</label>
                            <input
                                onChange={(e) => setPhone(e.target.value)}
                                type="tel"
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required={userType === "Restaurant"}
                                pattern="[9876][0-9]{9}"
                                title="Enter Your 10-Digit Mobile Number (Starting with 9, 8, 7, or 6)"
                                value={phone}
                            />
                        </div>
                    </>
                )}
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        onChange={(e) => setPass(e.target.value)}
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        required
                        value={pass}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Profile Url</label>
                    <input
                        onChange={(e) => setProfileUrl(e.target.value)} // Updated to setProfileUrl
                        type="text"
                        required
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600">
                    Register
                </button>
                <div className="mt-2 text-center">
                    <a onClick={Login} className="text-blue-500 cursor-pointer">Already have an account? Log in now</a>
                </div>
            </form>
        </div>
    );
};
