const Officer = require('../schema/Officer')
const Hotel = require('../schema/Hotel')
const bcrypt = require('bcryptjs');


const AddOfficer = async (req, res) => {
    const { name, email, password, district } = req.body
    const image = req.file.filename;

    try {
        // Check if an officer with the same email or district exists
        const officer = await Officer.findOne({
            $or: [
                { email: email },
                { district: district }
            ]
        })

        if (officer) {
            // Check if the conflict is due to the email or district
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
            image: image
        })

        // Hash the password
        newOfficer.password = await bcrypt.hash(password, 10)

        // Save the new officer
        await newOfficer.save()

        if (newOfficer) {
            return res.status(201).json({ success: true, officer: newOfficer, msg: 'Inspector registered' })
        }
    }
    catch (err) {
        return res.status(500).json(err)
    }
}

const GetOfficer = async (req, res) => {
    try {
        const officers = await Officer.find()
        if (officers) {
            return res.status(200).json({ success: true, officers: officers, msg: 'fetching success' })
        }
        return res.status(200).json({ success: false, msg: 'fetching error' })
    }
    catch (err) {
        return res.status(500).json(err)
    }
}

const UpdateOfficer = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, district } = req.body;

    // Initialize update data
    let updateData = { name, email, district };

    // Conditionally include image if it exists
    if (req.file && req.file.filename) {
        updateData.image = req.file.filename;
    }

    try {
        // Find and update the officer
        const update = await Officer.findByIdAndUpdate(id, updateData, { new: true });

        // Hash the password only if it's provided
        if (password) {
            update.password = await bcrypt.hash(password, 10);
        }

        await update.save();

        if (update) {
            return res.status(201).json({ success: true, officer: update, msg: 'Update successful' });
        }
        return res.status(200).json({ success: false, msg: 'Update error' });
    } catch (err) {
        return res.status(500).json({ success: false, msg: 'Server error', error: err.message });
    }
}


const Report = async (req, res) => {
    try {
        const { id } = req.params
        const documentPath = req.file.filename;


        await Officer.findByIdAndUpdate(id, { document: documentPath });

        res.status(200).json({ message: 'Document upload successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error uploading document' });
    }
}

const DeleteOfficer = async (req, res) => {
    const { id } = req.params

    try {

        const deleteOfficer = await Officer.findByIdAndDelete(id)

        if (deleteOfficer) {
            return res.status(201).json({ success: true, officer: deleteOfficer, msg: 'delete successful' })
        }
        return res.status(201).json({ success: false, msg: 'delete error' })
    }
    catch (err) {
        return res.status(500).json(err)
    }

}

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
        res.status(200).send({ success: true, msg: 'inspection sent successfully' });
    } catch (err) {
        res.status(500).send({ success: false, msg: 'Error sending complaint' });
    }
}

const GetInspection = async (req, res) => {
    const { officerId } = req.params;

    try {
        // Find all officer with inspections from the given officerId
        const officer = await Officer.find({ "inspections.hotelId": officerId }).exec();

        if (!officer.length) {
            return res.status(404).json({ success: false, msg: 'No inspections found for this user.' });
        }


        const inspection = officer.flatMap(data =>
            data.inspectionDetails.filter(insp => insp.hotelId === officerId)
        );

        res.json({ success: true, inspection });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
}

const Permission = async (req, res) => {
    const { officerId, title, details, status } = req.body;

    try {

        const officer = await Officer.findById(officerId);

        if (!officer) {
            return res.status(200).json({ success: false, msg: 'Officer not found' });
        }


        officer.permission.push({ title, details, status });


        await officer.save();

        res.status(201).json({ success: true, msg: 'Permission sent successfully', permission: officer.permission });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};

const PermUpdate = async (req, res) => {
    const { officerId, permissionId, status } = req.body;

    try {
        const officer = await Officer.findOneAndUpdate(
            { _id: officerId, 'permission._id': permissionId },
            { $set: { 'permission.$.status': status } },
            { new: true }
        );

        if (officer) {
            res.status(200).json({ success: true, msg: 'Permission Granted  successfully' });
        } else {
            res.status(200).json({ success: false, msg: 'something went wrong' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}

const AddNotification = async (req, res) => {
    const { officerId, title, message } = req.body;

    try {

        const officer = await Officer.findById(officerId);

        if (!officer) {
            return res.status(200).json({ success: false, msg: 'Officer not found' });
        }


        officer.notification.push({ title, message });


        await officer.save();

        res.status(201).json({ success: true, msg: 'message sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
}

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
}