import mongoose from 'mongoose';
import { MONGO_URI as url } from '../config';

export default function(){
    mongoose.connect(url);
    const connection = mongoose.connection;
    connection.once('open', ()=>{console.log('db connected successfully!')})
    connection.on('error', ()=>{console.log('db failed to connect!')})
};