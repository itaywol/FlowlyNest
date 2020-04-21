import * as mongoose from 'mongoose';

export const SessionSchema = new mongoose.Schema({
    expires: { type: Date, required: true} ,
    session: { type: {
        cookie: Object,
        passport: {
            userId: mongoose.SchemaTypes.ObjectId,
        },
    }, required: true },
});