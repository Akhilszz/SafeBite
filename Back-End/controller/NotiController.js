const Noti = require('../schema/Notification')
const Hotel = require('../schema/Hotel')


const PublicNoti = async (req, res) => {

    const { title, details } = req.body
    try {
        const newNoti = new Noti({ title, details })
        await newNoti.save()

        if (newNoti) {
            return res.status(201).json({ success: true, msg: 'notification entered successfully' })
        }
        return res.status(200).json({ success: false, mag: 'error' })
    }
    catch (err) {
        return res.status(500).json({ msg: err })
    }
}

const HotelNoti = async (req, res) => {
    const { id } = req.params;
    const { notification, title } = req.body;

    try {

        const hotel = await Hotel.findById(id);

        if (!hotel) {
            return res.status(200).json({ success: false, msg: 'Hotel not found' });
        }


        hotel.notification.push({
            title: title,
            message: notification,
            date: new Date()
        });

        await hotel.save();

        return res.status(201).json({ success: true, msg: 'Notification entered successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, msg: 'Server error', error: err.message });
    }
}


const GetNoti = async (req, res) => {
    try {
        const get = await Noti.find()

        if (get) {
            return res.status(200).json({ success: true, Noti: get, msg: 'success fetched' })
        }
        return res.status(200).json({ success: false, msg: 'error' })
    }
    catch (err) {
        return res.status(500).json({ err })
    }
}

module.exports = {
    PublicNoti,
    HotelNoti,
    GetNoti
}