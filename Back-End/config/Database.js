const mongoose = require('mongoose')


const Connect = async () => {
    try {
       await mongoose.connect('mongodb://localhost:27017/FoodSafety')
            .then(() => {
                console.log('DB connected successfully');
            })
    }
    catch (err) {
        console.log('DB error', err);
    }

}

module.exports = Connect