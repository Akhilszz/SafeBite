const User = require('../schema/User');
const Hotel = require('../schema/Hotel');
const bcrypt = require('bcryptjs');

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, image } = req.body; // Image is treated as a string

        console.log(image);

        // Check if the user already exists in either User or Hotel schema
        let user = await User.findOne({ email }) || await Hotel.findOne({ email });

        if (user) {
            return res.status(200).json({ success: false, msg: 'User already exists' });
        }

        // Create a new user
        user = new User({
            name,
            email,
            password,
            image, // Image as a string
        });

        // Hash the password
        user.password = await bcrypt.hash(password, 10);

        // Save the new user
        await user.save();

        return res.status(201).json({ success: true, msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all users
const GetUser = async (req, res) => {
    try {
        const users = await User.find();

        if (users) {
            return res.status(200).json({ success: true, users, msg: 'Fetched successfully' });
        } else {
            return res.status(200).json({ msg: 'Fetching error' });
        }
    } catch (err) {
        return res.status(500).json(err);
    }
};

// Update user status and details
const updateUserStatus = async (req, res) => {
    const { id } = req.params;
    const { status, name, email, password, image } = req.body;
    let updateData = { status, name, email, image }; // Treat image as a string

    try {
        // Hash the password if it's provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        // Update the user details
        const updated = await User.findByIdAndUpdate(id, updateData, { new: true });

        if (updated) {
            return res.status(200).json({ success: true, users: updated, msg: 'Status update successful' });
        } else {
            return res.status(200).json({ success: false, msg: 'User not found' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, msg: 'Status update failed', error: err.message });
    }
};

// Fetch a single user by ID
const FetchUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);

        if (user) {
            return res.status(200).json({ success: true, user, msg: 'Fetched successfully' });
        } else {
            return res.status(200).json({ success: false, msg: 'User not found' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, msg: 'Server error', error: err.message });
    }
};

// Delete a user by ID
const Delete = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);

        if (user) {
            res.status(200).json({ success: true, msg: 'User deleted successfully' });
        } else {
            res.status(200).json({ success: false, msg: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server error', error: err.message });
    }
};

module.exports = {
    registerUser,
    GetUser,
    updateUserStatus,
    FetchUser,
    Delete
};
