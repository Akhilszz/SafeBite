const Officer = require('../schema/Officer');
const Hotel = require('../schema/Hotel');
const bcrypt = require('bcryptjs');

// Add a new officer
const AddOfficer = async (req, res) => {
    const { name, email, password, district, image } = req.body;

    try {
        // Check if an officer with the same email or district exists
        const officer = await Officer.findOne({
            $or: [
                { email: email },
                { district: district }
            ]
        });

        if (officer) {
            const msg = officer.email === email
                ? 'Officer with this email already exists'
                : 'Officer already exists in this district';
            return res.status(200).json({ success: false, msg });
        }

        // Create a new officer
        const newOfficer = new Officer({
            name: name,
            email: email,
            password: password,
            district: district,
            image: image // Image is treated as a string
        });

        // Hash the password
        newOfficer.password = await bcrypt.hash(password, 10);

        // Save the new officer
        await newOfficer.save();

        if (newOfficer) {
            return res.status(201).json({ success: true, officer: newOfficer, msg: 'Officer registered successfully' });
        }
    } catch (err) {
        return res.status(500).json(err);
    }
};

// Get all officers
const GetOfficer = async (req, res) => {
    try {
        const officers = await Officer.find();
        if (officers) {
            return res.status(200).json({ success: true, officers: officers, msg: 'Fetching successful' });
        }
        return res.status(200).json({ success: false, msg: 'Fetching error' });
    } catch (err) {
        return res.status(500).json(err);
    }
};

// Update officer details
const UpdateOfficer = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, district, image } = req.body;

    // Initialize update data
    let updateData = { name, email, district, image };

    try {
        // Find and update the officer
        const update = await Officer.findByIdAndUpdate(id, updateData, { new: true });

        // Hash the password only if provided
        if (password) {
            update.password = await bcrypt.hash(password, 10);
            await update.save();
        }

        if (update) {
            return res.status(201).json({ success: true, officer: update, msg: 'Update successful' });
        }
        return res.status(200).json({ success: false, msg: 'Update error' });
    } catch (err) {
        return res.status(500).json({ success: false, msg: 'Server error', error: err.message });
    }
};

// Upload document or image as a string
const Report = async (req, res) => {
    try {
        const { id } = req.params;
        const { document } = req.body;

        await Officer.findByIdAndUpdate(id, { document: document }); // Document is treated as a string
        res.status(200).json({ message: 'Document uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error uploading document' });
    }
};

// Delete an officer
const DeleteOfficer = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteOfficer = await Officer.findByIdAndDelete(id);

        if (deleteOfficer) {
            return res.status(201).json({ success: true, officer: deleteOfficer, msg: 'Delete successful' });
        }
        return res.status(201).json({ success: false, msg: 'Delete error' });
    } catch (err) {
        return res.status(500).json(err);
    }
};

// Add an inspection record
const Inspection = async (req, res) => {
    const { officerId, hotelId, inspection } = req.body;
    try {
        await Officer.updateOne(
            { _id: officerId },
            { $push: { inspectionDetails: { hotelId, inspection } } }
        );
        await Hotel.updateOne(
            { _id: hotelId },
            { $push: { inspectionDetails: { officerId, inspection } } }
        );
        res.status(200).json({ success: true, msg: 'Inspection record added successfully' });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Error adding inspection' });
    }
};

// Fetch inspections for a specific officer
const GetInspection = async (req, res) => {
    const { officerId } = req.params;

    try {
        const officer = await Officer.find({ "inspectionDetails.hotelId": officerId }).exec();

        if (!officer.length) {
            return res.status(404).json({ success: false, msg: 'No inspections found for this officer.' });
        }

        const inspection = officer.flatMap(data =>
            data.inspectionDetails.filter(insp => insp.hotelId === officerId)
        );

        res.json({ success: true, inspection });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};

// Manage permissions for an officer
const Permission = async (req, res) => {
    const { officerId, title, details, status } = req.body;

    try {
        const officer = await Officer.findById(officerId);

        if (!officer) {
            return res.status(200).json({ success: false, msg: 'Officer not found' });
        }

        officer.permission.push({ title, details, status });
        await officer.save();

        res.status(201).json({ success: true, msg: 'Permission added successfully', permission: officer.permission });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};

// Update permission status for an officer
const PermUpdate = async (req, res) => {
    const { officerId, permissionId, status } = req.body;

    try {
        const officer = await Officer.findOneAndUpdate(
            { _id: officerId, 'permission._id': permissionId },
            { $set: { 'permission.$.status': status } },
            { new: true }
        );

        if (officer) {
            res.status(200).json({ success: true, msg: 'Permission updated successfully' });
        } else {
            res.status(200).json({ success: false, msg: 'Update error' });
        }
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};

// Add a notification for an officer
const AddNotification = async (req, res) => {
    const { officerId, title, message } = req.body;

    try {
        const officer = await Officer.findById(officerId);

        if (!officer) {
            return res.status(200).json({ success: false, msg: 'Officer not found' });
        }

        officer.notification.push({ title, message });
        await officer.save();

        res.status(201).json({ success: true, msg: 'Notification added successfully' });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};

module.exports = {
    AddOfficer,
    GetOfficer,
    UpdateOfficer,
    DeleteOfficer,
    Inspection,
    GetInspection,
    Permission,
    Report,
    PermUpdate,
    AddNotification
};
