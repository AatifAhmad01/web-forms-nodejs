import mongoose, { Schema } from "mongoose";

const formResponseSchema = new Schema({
    formId: {
        type: Schema.Types.ObjectId,
        ref: 'Form',
        required: true,
    },
    answers: {
        type: Array,
        required: true,
    },
    creator: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

export const FormResponse = mongoose.model('FormResponse', formResponseSchema);