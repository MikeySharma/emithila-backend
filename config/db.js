const mongoose = require('mongoose');

const connectToMongo = () =>{
    try{
        mongoose.connect(process.env.MONGODB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }catch(error){
        console.log(error);
    }
    console.log('Connected to Mongoose Successfully')
}

module.exports = connectToMongo;