import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const Login = () => {
    const nav = useNavigate();
    const serverUrl = 'https://safe-bite.vercel.app'

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [otp, setOtp] = useState(""); // New state for OTP
    const [newPassword, setNewPass] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false); // Toggle OTP input

    useEffect(() => {
        Check()
    }, []);

    function Check() {
        if (localStorage.getItem('userEmail')) {
            nav('/home');
        }
        else if (localStorage.getItem('hotelEmail')) {
            nav(`/hotelMain`);
        }
        else if (localStorage.getItem('officerEmail')) {
            nav('/requests');
        }
        else if (localStorage.getItem('adminEmail')) {
            nav(`/officer`);
        }
        else {
            console.log('local storage empty');
        }
    }

    async function submit(e) {
        e.preventDefault();
        setError("");
        try {
            const res = await axios.post(`${serverUrl}/api/login`, {
                email: email,
                password: pass
            });

            if (res.data.success) {
                alert('Login successful');

                if (res.data.userType === 'regular') {
                    localStorage.setItem('authTokenUser', res.data.authToken);
                    localStorage.setItem('userName', res.data.userName);
                    localStorage.setItem('userImage', res.data.userImage);
                    localStorage.setItem('userID', res.data.userID);
                    localStorage.setItem('userEmail', res.data.userEmail);
                    nav('/home');
                } else if (res.data.userType === 'hotel') {
                    localStorage.setItem('authTokenHotel', res.data.authToken);
                    localStorage.setItem('hotelName', res.data.hotelName);
                    localStorage.setItem('hotelImage', res.data.hotelImage);
                    localStorage.setItem('hotelEmail', res.data.hotelEmail);
                    localStorage.setItem('hotelID', res.data.hotelID);
                    nav(`/hotelMain`);
                } else if (res.data.userType === 'admin') {
                    localStorage.setItem('authTokenHotel', res.data.authToken);
                    localStorage.setItem('adminName', res.data.adminName);
                    localStorage.setItem('adminImage', res.data.adminImage);
                    localStorage.setItem('adminEmail', res.data.adminEmail);
                    localStorage.setItem('adminID', res.data.adminID);
                    nav(`/officer`);
                } else {
                    localStorage.setItem('authTokenOfficer', res.data.authToken);
                    localStorage.setItem('officerName', res.data.officerName);
                    localStorage.setItem('officerImage', res.data.officerImage);
                    localStorage.setItem('officerEmail', res.data.officerEmail);
                    localStorage.setItem('officerID', res.data.officerID);
                    localStorage.setItem('officerDistrict', res.data.officerDistrict);
                    nav('/requests');
                }

            } else {
                setError(res.data.msg);
            }
        } catch (err) {
            console.error(err.message);
            setError('An error occurred. Please try again.');
        }
    }

    function register() {
        nav('/register');
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await axios.post(`${serverUrl}/api/forgotpassword`, {
                email: forgotEmail,
            });

            if (res.data.success) {
                alert(res.data.msg)
                setShowOtpInput(true); // Show OTP input after successful email submission
            } else {
                alert(res.data.msg)
                setError(res.data.msg);
            }
        } catch (err) {
            console.error(err.message);
            setError('An error occurred. Please try again.');
        }
    };

    async function handleResetPassword(e) {
        e.preventDefault();
        setError("");
        try {
            const res = await axios.post(`${serverUrl}/api/resetpassword`, {
                email: forgotEmail,
                otp, // Send OTP along with the new password
                password: newPassword,
            });

            if (res.data.success) {
                alert(res.data.msg);
                setShowNewPassword(false);
                setShowForgotPassword(false);
                setShowOtpInput(false);
            } else {
                alert(res.data.msg)
                setError(res.data.msg);
            }
        } catch (err) {
            console.error(err.message);
            setError('An error occurred. Please try again.');
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form className="bg-white p-6 rounded shadow-md w-96 m-8" onSubmit={submit}>
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        required
                        pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        onChange={(e) => setPass(e.target.value)}
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600">
                    Login
                </button>
                <div className="mt-4 text-center">
                    <a onClick={register} className="text-blue-500 cursor-pointer">Don't have an account? Register now</a>
                </div>
                <div className="mt-4 text-center">
                    <a onClick={() => setShowForgotPassword(!showForgotPassword)} className="text-blue-500 cursor-pointer">Forgot Password?</a>
                </div>
                {showForgotPassword && (
                    <div className="mt-4">
                        <label className="block text-gray-700">Enter your email to reset password</label>
                        <input
                            onChange={(e) => setForgotEmail(e.target.value)}
                            type="email"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                            pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                        />
                        <button onClick={handleForgotPassword} className="w-full bg-green-500 text-white p-2 rounded mt-4 hover:bg-green-600">
                            Submit
                        </button>
                    </div>
                )}
                {showOtpInput && (
                    <div className="mt-4">
                        <label className="block text-gray-700">Enter the OTP sent to your email</label>
                        <input
                            onChange={(e) => setOtp(e.target.value)}
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
                    </div>
                )}
                {showOtpInput && (
                    <div className="mt-4">
                        <label className="block text-gray-700">Enter your new password</label>
                        <input
                            onChange={(e) => setNewPass(e.target.value)}
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        // pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$"
                        // title="Password must be at least 8 characters long and include at least one letter and one digit"
                        />
                        <button onClick={handleResetPassword} className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600">
                            Reset Password
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};
