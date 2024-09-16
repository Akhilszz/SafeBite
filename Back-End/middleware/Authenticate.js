const Officer = require('../schema/Officer');
const User = require('../schema/User')
const Hotel = require('../schema/Hotel')
const Admin = require('../schema/Admin')
const jwt = require('jsonwebtoken');
const jwtkey = 'aki123';

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ success: false, msg: 'Token not found' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decode = jwt.verify(token, jwtkey);

        if (!decode) {
            return res.status(401).json({ success: false, msg: 'Token error' });
        }

        const user = await Officer.findOne({ email: decode.email }) ||
            await User.findOne({ email: decode.email }) ||
            await Admin.findOne({ email: decode.email }) ||
            await Hotel.findOne({ email: decode.email })


        if (!user) {
            return res.status(404).json({ success: false, msg: 'user not found' });
        }


        next();
    } catch (err) {
        return res.status(500).json({ msg: "Internal server error", err });
    }
};

module.exports = { authenticate };
