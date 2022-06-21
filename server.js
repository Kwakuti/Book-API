process.on('uncaughtException', (error) => {
    console.log(`Uncaught Exception: ${error}`);
    process.exit(1);
});

const mongoose = require('mongoose');

const server = require('./app');

const DB_LINK = 'mongodb://localhost:27017/book-api';
const PORT_ADDRESS = 3000;

mongoose.connect(DB_LINK,(error, connection) => {
    if(error) {
        console.log(error);
        return;
    }
    console.log('Database connected successfully...');
});

const serverObject = server.listen(PORT_ADDRESS, (error) => {
    if(error) {
        console.log(`Server Error: ${error}`);
    }
    console.log(`Server is online at port: ${PORT_ADDRESS}`);
    return;
});

process.on('unhandledRejection', (error) => {
    console.log(`Unhandled Rejection: ${error}`);
    process.exit(1);
});