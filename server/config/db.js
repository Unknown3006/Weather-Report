const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Test database write
        const db = mongoose.connection;
        db.once('open', async () => {
            console.log('Testing database write access...');
            try {
                await db.collection('test').insertOne({ test: 'test' });
                console.log('Database write test successful');
                await db.collection('test').deleteOne({ test: 'test' });
            } catch (error) {
                console.error('Database write test failed:', error);
            }
        });
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;