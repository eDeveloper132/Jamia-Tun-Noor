// lib/mongodb.ts
import mongoose from 'mongoose';
import URI from '../config/config.js';
if (!URI) {
    throw new Error('Invalid/Missing "URI"');
}
const uri = process.env.MONGODB_URI;
const options = {
    appName: 'JamiaTunNoorApp', // Optional: Name of your application
    maxPoolSize: 20, // Maximum number of connections in the pool
    minPoolSize: 5, // Minimum number of connections to keep open
    connectTimeoutMS: 10000, // 10 seconds to establish a connection
    socketTimeoutMS: 30000, // 30 seconds to wait for a server response
    serverSelectionTimeoutMS: 10000, // 10 seconds to select a server
    retryWrites: true, // Enable retryable writes
    retryReads: true, // Enable retryable reads
    // ssl: true,            // Uncomment and configure if SSL/TLS is required
    // authMechanism: 'SCRAM-SHA-256', // Uncomment if specific auth mechanism is needed
    // …any other mongoose options
};
// Initialize cache on first import
global.mongoose ??= { conn: null, promise: null };
async function connectToDatabase() {
    if (global.mongoose.conn) {
        return global.mongoose.conn;
    }
    if (!global.mongoose.promise) {
        global.mongoose.promise = mongoose
            .connect(URI, options)
            .then((mongooseInstance) => {
            mongooseInstance.connection.on('error', (err) => {
                console.error('⚠️ Mongoose connection error:', err);
            });
            mongooseInstance.connection.on('disconnected', () => {
                console.warn('⚠️ Mongoose disconnected');
            });
            mongooseInstance.connection.on('reconnected', () => {
                console.log('✅ Mongoose reconnected');
            });
            console.log('✅ MongoDB connected');
            return mongooseInstance;
        })
            .catch((err) => {
            console.error('❌ Failed to connect to MongoDB:', err);
            return null;
        });
    }
    global.mongoose.conn = await global.mongoose.promise;
    return global.mongoose.conn;
}
export default connectToDatabase;
//# sourceMappingURL=db.js.map