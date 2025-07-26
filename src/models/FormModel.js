import mongoose, { Schema } from "mongoose";

const formSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    questions: {
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
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export const Form = mongoose.model('Form', formSchema);