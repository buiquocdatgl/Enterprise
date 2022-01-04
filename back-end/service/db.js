const db = {};
const mongoose = require('mongoose');
const User = require('../model/user');

mongoose.Promise = global.Promise;

db.mongoose = mongoose;

db.seedData = async () => {
    try {
        const userInDbCount = await User.estimatedDocumentCount();
        if(!userInDbCount) {
            const admin = new User({
                username: 'admin',
                password: 'admin@123',
                fullname: "Administrator",
                dateOfBirth: new Date(),
                age: 21,
                gender: 'male',
                roles: process.env.ADMIN
            });
            await admin.save();
            console.log("Account seeded");
        }
    } catch (error) {
        console.error(error)
    }
}

db.connect = async (dbConnectionUrl) => {
    try {
        await mongoose.connect(dbConnectionUrl, {useUnifiedTopology: true, useNewUrlParser: true});
        await db.seedData();
        console.log('DB connected');
    } catch (error) {
       console.error(`Connecting error: ${error}`);
    }
}

module.exports = db;
