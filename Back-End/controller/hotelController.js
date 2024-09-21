const Hotel = require('../schema/Hotel');
const User = require('../schema/User');
const Officer = require('../schema/Officer')
const bcrypt = require('bcryptjs');


const registerHotel = async (req, res) => {
    try {
        const { name, email, address, request, password, liceno, image } = req.body;

        let parsedAddress;
        try {
            parsedAddress = JSON.parse(address);
        } catch (err) {
            return res.status(200).json({ success: false, msg: 'Invalid address format' });
        }

        // Check if a hotel or user already exists with the same email
        let hotel = await Hotel.findOne({ email }) || await User.findOne({ email });
        if (hotel) {
            return res.status(200).json({ success: false, msg: 'User already exists' });
        }

        // Create and save the hotel
        hotel = new Hotel({
            name,
            email,
            address: parsedAddress,
            request,
            password: await bcrypt.hash(password, 10),
            image, // Store the image string
            liceno,
        });

        await hotel.save();
        return res.status(201).json({ success: true, msg: 'Hotel registered successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};



const GetHotel = async (req, res) => {

    try {
        const Hotels = await Hotel.find()

        if (Hotels) {
            return res.status(200).json({ success: true, Hotel: Hotels, msg: "Fetched Successfully" })
        }
        else {
            return res.status(200).json({ success: false, msg: "Fetching error" })
        }
    }
    catch (err) {
        return res.status(500).send('server error')
    }
}

const Update = async (req, res) => {
    const { id } = req.params;

    let updateData = {}; // Initialize an empty object for the fields to update

    // If image file is provided, add it to the update data
    // if (req.file) {
    //     updateData.image = req.file.filename;
    // }

    // Destructure the body fields
    const { request, blacklist, penalty, address, rating, status, liceno, image } = req.body;

    // Conditionally add each field if it is provided
    if (request) {
        updateData.request = request;
    }
    if (image) {
        updateData.image = image;
    }

    if (blacklist !== undefined) {
        updateData.blacklist = blacklist;
    }

    if (penalty !== undefined) {
        updateData.penalty = penalty;
    }

    if (rating !== undefined) {
        updateData.rating = rating;
    }

    if (status) {
        updateData.status = status;
    }

    if (liceno) {
        updateData.liceno = liceno;
    }

    // If the address is provided, parse and add it
    if (address) {
        try {
            updateData.address = JSON.parse(address);
        } catch (err) {
            return res.status(200).json({ success: false, msg: 'Invalid address format' });
        }
    }

    try {
        // Perform the update operation
        const update = await Hotel.findByIdAndUpdate(id, updateData, { new: true });

        // Check if the hotel was found and updated
        if (!update) {
            return res.status(200).json({ success: false, msg: 'Hotel not found' });
        }

        // Return success response with updated data
        return res.status(200).json({ success: true, Hotel: update });

    } catch (err) {
        // Handle server errors
        res.status(500).json({ success: false, err });
    }
};



const AddComp = async (req, res) => {
    const { userId, hotelId, complaint, proof } = req.body;

    try {
        await User.updateOne(
            { _id: userId },
            { $push: { complaints: { hotelId, complaint, proof } } } // Storing proof as a string
        );
        await Hotel.updateOne(
            { _id: hotelId },
            { $push: { complaints: { userId, complaint, proof } } }
        );
        res.status(200).send({ success: true, msg: 'Complaint sent successfully' });
    } catch (err) {
        res.status(500).send({ success: false, msg: 'Error sending complaint' });
    }
};


const AddSugge = async (req, res) => {
    const { userId, hotelId, suggestion } = req.body;

    try {

        const userUpdate = await User.findByIdAndUpdate(userId, {
            $push: { suggestions: { hotelId, suggestion } }
        }, { new: true });

        const hotelUpdate = await Hotel.findByIdAndUpdate(hotelId, {
            $push: { suggestions: { userId, suggestion } }
        }, { new: true });

        if (!userUpdate || !hotelUpdate) {
            return res.status(200).json({ success: false, msg: 'User or Hotel not found' });
        }
        // console.log(hotelUpdate);

        res.json({ success: true, msg: 'Suggestion added successfully' });
    } catch (err) {
        console.error('Error adding suggestion:', err);
        res.status(500).json({ success: false, msg: 'Server error: ' + err.message });
    }
}

const fetchHotel = async (req, res) => {
    const { email } = req.body

    try {
        const fetched = await Hotel.find({ email })

        if (fetched) {
            return res.status(200).json({ success: true, hotel: fetched })
        }
        return res.status(200).json({ success: false, msg: 'fetch error' })
    }
    catch (err) {
        return res.status(500).send(err)
    }
}

const ReplyComp = async (req, res) => {
    try {
        const { hotelId, itemId, reply } = req.body;
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) return res.status(200).json({ success: false, msg: 'Hotel not found' });

        const complaint = hotel.complaints.id(itemId);
        if (!complaint) return res.status(200).json({ success: false, msg: 'Complaint not found' });

        complaint.reply = reply;
        await hotel.save();

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
}

const ReplySug = async (req, res) => {
    try {
        const { hotelId, itemId, reply } = req.body;
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) return res.status(200).json({ success: false, msg: 'Hotel not found' });

        const suggestion = hotel.suggestions.id(itemId);
        if (!suggestion) return res.status(200).json({ success: false, msg: 'Suggestion not found' });

        suggestion.reply = reply;
        await hotel.save();

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
}

const GetSug = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find all hotels with suggestions from the given userId
        const hotels = await Hotel.find({ "suggestions.userId": userId }).exec();

        if (!hotels.length) {
            return res.status(200).json({ success: false, msg: 'No suggestions found for this user.' });
        }

        // Extract and filter the suggestions associated with the given userId
        const suggestions = hotels.flatMap(hotel =>
            hotel.suggestions.filter(sug => sug.userId.toString() === userId)
        );

        res.json({ success: true, suggestions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
}


const GetCom = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find all hotels with complaints from the given userId
        const hotels = await Hotel.find({ "complaints.userId": userId }).exec();

        if (!hotels.length) {
            return res.status(200).json({ success: false, msg: 'No complaints found for this user.' });
        }

        // Extract and filter the complaints associated with the given userId
        const complaints = hotels.flatMap(hotel =>
            hotel.complaints.filter(comp => comp.userId.toString() === userId)
        );

        res.json({ success: true, complaints });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
}


const Comp = async (req, res) => {
    try {
        // Find the hotel by ID
        const hotel = await Hotel.findById(req.params.id).exec();

        // Check if hotel exists
        if (!hotel) {
            return res.status(200).json({ success: false, message: 'Hotel not found' });
        }

        // Return the complaints
        res.json({ success: true, complaints: hotel.complaints });
    } catch (err) {
        // Log the error for debugging
        console.error(err);

        // Return a server error response
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

const GetInspection = async (req, res) => {
    const { hotelId } = req.body

    try {
        // Find the hotel by hotelId
        const hotel = await Officer.findOne({ "inspectionDetails.hotelId": hotelId }).exec();
        // console.log(hotel);


        if (!hotel) {
            return res.status(200).json({ success: false, msg: 'No inspections found for this hotel.' });
        }

        // Extract inspection details
        const inspection = hotel.inspectionDetails.filter(insp => insp.hotelId.toString() === hotelId);



        if (inspection.length === 0) {
            return res.status(200).json({ success: false, msg: 'No inspections found for this hotel.' });
        }

        res.json({ success: true, inspection });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
}

const DocumentUpload = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const { document } = req.body; // Document received as a string (URL/base64)

        if (!document) {
            return res.status(400).send('No document uploaded.');
        }

        // Update the hotel with the document string and status
        const updatedHotel = await Hotel.findByIdAndUpdate(
            hotelId,
            { document: document, status: 'uploaded' },
            { new: true }
        );

        if (!updatedHotel) {
            return res.status(200).json({ error: 'Hotel not found' });
        }

        res.status(200).json({
            message: 'Document uploaded successfully',
            hotel: updatedHotel,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload document' });
    }
};




module.exports = {
    registerHotel,
    GetHotel,
    Update,
    AddComp,
    AddSugge,
    fetchHotel,
    ReplyComp,
    ReplySug,
    GetCom,
    GetSug,
    Comp,
    GetInspection,
    DocumentUpload

}
