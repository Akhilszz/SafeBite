import { useContext, useState } from 'react';
import { Nav } from './Nav';
import { mycontext } from '../Context/MyContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const PaymentPage = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [error, setError] = useState('');

    const nav = useNavigate()

    const { amount, id, setAmount } = useContext(mycontext);

    const serverURL = 'https://safe-bite-czz1t4l2z-akhilszzs-projects.vercel.app'

    async function handlePay() {

        setError('');


        if (!cardNumber || !expiryDate || !cvv) {
            setError('Please fill in all the fields.');
            return;
        }

        if (cardNumber.length !== 16) {
            setError('Card number must be 16 digits.');
            return;
        }

        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            setError('Expiry date format should be MM/YY.');
            return;
        }

        if (cvv.length !== 3) {
            setError('CVV must be 3 digits.');
            return;
        }

        try {

            const res = await axios.put(`${serverURL}/api/blacklist/${id}`, {
                penalty: 0,
            });

            if (res.data.success) {

                alert('Payment successful!');
                nav('/hotelMain')

            } else {
                setError(res.data.msg || 'Payment failed.');
                setAmount('')
                setCardNumber('')
                setCvv('')
                setExpiryDate('')
            }
        } catch (err) {
            console.log('update error', err);
            setError('An error occurred while processing the payment.');
        }
    }

    return (
        <div>
            <Nav />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6">Payment</h2>
                    <form>
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-600 border border-red-300 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="mb-4">
                            <label htmlFor="amount" className="block text-sm font-semibold mb-2">Amount</label>
                            <input
                                type="text"
                                id="amount"
                                value={amount}
                                readOnly
                                className="w-full p-3 border border-gray-300 rounded-md"
                                placeholder="$100.00"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="cardNumber" className="block text-sm font-semibold mb-2">Card Number</label>
                            <input
                                type="text"
                                id="cardNumber"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md"
                                placeholder="1234 5678 9012 3456"
                                required
                            />
                        </div>
                        <div className="flex mb-4 space-x-4">
                            <div className="flex-1">
                                <label htmlFor="expiryDate" className="block text-sm font-semibold mb-2">Expiry Date</label>
                                <input
                                    type="text"
                                    id="expiryDate"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md"
                                    placeholder="MM/YY"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="cvv" className="block text-sm font-semibold mb-2">CVV</label>
                                <input
                                    type="text"
                                    id="cvv"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md"
                                    placeholder="123"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handlePay}
                            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                        >
                            Pay Now
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
