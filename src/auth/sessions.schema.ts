import { ObjectId } from 'mongodb';
import * as mongoose from 'mongoose';

export const SessionSchema = new mongoose.Schema({
    _id: { type: String, unique: true, required: true },
    expires: { type: Date, required: true} ,
    session: { type: {
        cookie: Object,
        passport: {
            userId: ObjectId,
        },
    }, required: true },
});