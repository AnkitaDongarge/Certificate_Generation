const mongoose = require("mongoose");


const mongoDB = 'mongodb+srv://khushi14khush:BC0x7y6fJJSp7wFf@cluster0.0giddj2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('connected to MongoDB');
}).catch(err => console.log(err));


connect.then(() => {
    console.log("Database connected successfully");
}).catch((error) => {
    console.log("Database cannot be connected");
    console.error(error);
});
