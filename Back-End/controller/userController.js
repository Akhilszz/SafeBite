const User = require('../schema/User');
const Hotel = require('../schema/Hotel');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const image = req.file.filename

        console.log(image);

        let user = await User.findOne({ email }) || await Hotel.findOne({ email });

        if (user) {
            return res.status(200).json({ success: false, msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            image,
        });

        user.password = await bcrypt.hash(password, 10);

        await user.save();



        return res.status(201).json({ success: true, msg: 'User registered successfully' });

       
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


const GetUser = async (req, res) => {

    try {
        const user = await User.find()

        if (user) {
            return res.status(200).json({ success: true, users: user, msg: 'fetched successfully' })
        }
        else {
            return res.status(200).json({ msg: 'fetching error' })
        }
    }
    catch (err) {
        return res.status(500).json(err)
    }
}


const updateUSerStatus = async (req, res) => {
    const { id } = req.params;
    const { status, name, email, password } = req.body;
    let updateData = { status, name, email };

    // Conditionally add image if it's provided
    if (req.file && req.file.filename) {
        updateData.image = req.file.filename;
    }

    try {
        // Hash the password if it's provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        // Update the user
        const updated = await User.findByIdAndUpdate(id, updateData, { new: true });

        if (updated) {
            return res.status(200).json({ success: true, users: updated, msg: 'Status update successful' });
        } else {
            return res.status(200).json({ success: false, msg: 'User not found' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, msg: 'Status update failed', error: err.message });
    }
}



const FetchUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById(id); // Await the promise returned by findById

        if (user) {
            return res.status(200).json({ success: true, user: user, msg: 'Fetched successfully' });
        } else {
            return res.status(200).json({ success: false, msg: 'User not found' });
        }
    }
    catch (err) {
        return res.status(500).json({ success: false, msg: 'Server error', error: err.message });
    }
};

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
    updateUSerStatus,
    FetchUser,
    Delete
}
