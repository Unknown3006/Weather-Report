require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const testUser = {
            email: 'test@test.com',
            password: 'hashedpassword',
            preferredCity: 'TestCity'
        };

        await mongoose.connection.collection('users').insertOne(testUser);
        console.log('Test user inserted');

        const found = await mongoose.connection.collection('users').findOne({ email: 'test@test.com' });
        console.log('Found test user:', found);

        await mongoose.connection.collection('users').deleteOne({ email: 'test@test.com' });
        console.log('Test user deleted');

        await mongoose.connection.close();
    } catch (error) {
        console.error('Database test failed:', error);
    }
}

testConnection();