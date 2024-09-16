const User = require('../schema/User');
const Hotel = require('../schema/Hotel');
const Officer = require('../schema/Officer')
const Admin = require('../schema/Admin')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtkey = 'aki123';
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

const Login = async (req, res) => {

    const { email, password } = req.body



    try {
        const user = await User.findOne({ email: email })

        if (user) {
            if (user.status === 'block') {

                return res.status(200).json({ success: false, msg: 'user is blocked by admin' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {

                return res.status(200).json({ success: false, msg: 'Invalid credentials' });
            }

            const authToken = jwt.sign({ email: user.email }, jwtkey, { expiresIn: '1d' });

            return res.status(200).json({ success: true, userEmail: user.email, userID: user._id, userImage: user.image, userName: user.name, authToken: authToken, userType: 'regular' });

            console.log('Login success');

        }

        const hotel = await Hotel.findOne({ email: email })

        if (hotel) {

            const isMatch = await bcrypt.compare(password, hotel.password);

            if (!isMatch) {
                return res.status(200).json({ success: false, msg: 'Invalid credentials' });
            }

            const authToken = jwt.sign({ email: hotel.email }, jwtkey, { expiresIn: '1d' });

            return res.status(200).json({ success: true, hotelID: hotel._id, hotelName: hotel.name, hotelImage: hotel.image, hotelEmail: hotel.email, authToken: authToken, userType: 'hotel' });


        }
        const officer = await Officer.findOne({ email: email })

        if (officer) {

            const isMatch = await bcrypt.compare(password, officer.password);

            if (!isMatch) {

                return res.status(200).json({ success: false, msg: 'Invalid credentials' });
            }

            const authToken = jwt.sign({ email: officer.email }, jwtkey, { expiresIn: '1d' });

            return res.status(200).json({ success: true, officerID: officer._id, officerName: officer.name, officerEmail: officer.email, officerImage: officer.image, officerDistrict: officer.district, authToken: authToken, userType: 'officer' });

        }


        const admin = await Admin.findOne({ email: email })

        if (admin) {

            if (password !== admin.password) {

                return res.status(200).json({ success: false, msg: 'Invalid credentials' });
            }

            const authToken = jwt.sign({ email: admin.email }, jwtkey, { expiresIn: '1d' });

            return res.status(200).json({ success: true, adminID: admin._id, adminName: admin.name, adminEmail: admin.email, adminImage: admin.image, authToken: authToken, userType: 'admin' });

        }
        else {
            return res.status(200).json({ msg: 'user not found' })
        }

    }
    catch (err) {

        return res.status(500).json({ msg: 'server error' })
    }
}

const otpStore = {};

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: 'kickfiremartialarts@gmail.com',
        pass: 'mymf yzer tvcd loiz',
    },
});


const ForgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        let user = await Hotel.findOne({ email: email }) || await User.findOne({ email: email }) || await Officer.findOne({ email: email });

        if (!user) {
            return res.status(200).json({ success: false, msg: 'User not found' });
        }

        // Generate OTP
        const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

        // Store OTP with expiration (for production, store in DB/Redis with TTL)
        otpStore[email] = { otp, expiresIn: Date.now() + 10 * 60 * 1000 }; // 10 minutes expiry

        // Send OTP via email
        const mailOptions = {
            from: 'kickfiremartialarts@gmail.com',
            to: email,
            subject: 'Your OTP for Password Reset',
            text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, msg: 'OTP sent to email' });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error' });
    }
};

const ResetPassword = async (req, res) => {
    const { email, otp, password } = req.body;

    try {
        let user = await Hotel.findOne({ email: email }) || await User.findOne({ email: email }) || await Officer.findOne({ email: email });

        if (!user) {
            return res.status(200).json({ success: false, msg: 'User not found' });
        }

        // Verify OTP
        const storedOtp = otpStore[email];

        if (!storedOtp || storedOtp.otp !== otp) {
            return res.status(200).json({ success: false, msg: 'Invalid or expired OTP' });
        }

        // Check if OTP is expired
        if (storedOtp.expiresIn < Date.now()) {
            return res.status(200).json({ success: false, msg: 'OTP has expired' });
        }

        // Check if the new password is different from the old one
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            return res.status(200).json({ success: false, msg: 'Please enter a new password' });
        }

        // Update password
        user.password = await bcrypt.hash(password, 10);
        await user.save();

        // Clear the OTP after successful password reset
        delete otpStore[email];

        return res.status(201).json({ success: true, msg: 'Password updated successfully' });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error' });
    }
};


module.exports = {
    Login,
    ForgotPassword,
    ResetPassword
}