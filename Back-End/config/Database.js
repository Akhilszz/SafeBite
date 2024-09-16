const mongoose = require('mongoose')


const Connect = async () => {
    try {
        await mongoose.connect('mongodb+srv://new-user-123:new-user-123@cluster0.9wpyu.mongodb.net/FoodSafety?retryWrites=true&w=majority&appName=Cluster0')
            .then(() => {
                console.log('DB connected successfully');
            })
    }
    catch (err) {
        console.log('DB error', err);
    }

}

module.exports = Connect