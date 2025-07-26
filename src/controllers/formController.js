import asyncHanlder from "../utils/asyncHanlder.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Form, FormResponse } from "../models/index.js";

const createForm = asyncHanlder(async (req, res) => {

    const { title, description, questions = [], creator = 'Anonymous' } = req.body;

    console.log(questions);

    if (!title || !description || !questions) {
        throw new ApiError(400, 'All fields are required');
    }

    try {

        const form = await Form.create({ title, description, questions, creator });

        res.status(201).json({
            success: true,
            message: 'Form created successfully',
            data: form,
        });

    } catch (error) {
        throw new ApiError(500, 'Failed to create form', error.message);
    }
});

const submitForm = asyncHanlder(async (req, res) => {
    const { formId } = req.params;
    const { answers, creator } = req.body;

    try {

        const response = await FormResponse.create({ formId, answers, creator: creator || 'Anonymous' });

        if (!response) {
            throw new ApiError(500, 'Failed to submit form');
        }

        res.status(201).json(
            new ApiResponse(201, response, 'Response submitted successfully')
        );

    } catch (error) {
        throw new ApiError(500, 'Failed to submit form', error.message);
    }
});

const getForms = asyncHanlder(async (_, res) => {
    const forms = await Form.find();

    res.status(200).json(
        new ApiResponse(200, forms || [], 'Forms fetched successfully')
    );
});

const getForm = asyncHanlder(async (req, res) => {
    const { formId } = req.params;

    const form = await Form.findById(formId);

    if (!form) {
        throw new ApiError(404, 'Form not found');
    }

    res.status(200).json(
        new ApiResponse(200, form, 'Form fetched successfully')
    );
});

// const updateForm = asyncHanlder(async (req, res) => {
//     const { formId } = req.params;
//     const { title, description, questions } = req.body;
//     const form = await Form.findByIdAndUpdate(formId, { title, description, questions }, { new: true });
//     res.status(200).json(
//         new ApiResponse(200, form, 'Form updated successfully')
//     );
// });

const getResponses = asyncHanlder(async (req, res) => {
    const { formId } = req.params;
    const responses = await FormResponse.find({ formId });

    res.status(200).json(
        new ApiResponse(200, responses || [], 'Responses fetched successfully')
    );
});

const getResponse = asyncHanlder(async (req, res) => {
    const { responseId } = req.params;
    const response = await FormResponse.findById(responseId);

    if (!response) {
        throw new ApiError(404, 'Response not found');
    }

    res.status(200).json(
        new ApiResponse(200, response, 'Response fetched successfully')
    );
});

const deleteForm = asyncHanlder(async (req, res) => {
    const { formId } = req.params;

    const form = await Form.findByIdAndUpdate(formId, { isDeleted: true, isActive: false }, { new: true });

    if (!form) {
        throw new ApiError(404, 'Form not found');
    }

    res.status(200).json(
        new ApiResponse(200, form, 'Form deleted successfully')
    );
});


export {
    createForm,
    getForm,
    getForms,
    getResponses,
    getResponse,
    submitForm,
    deleteForm,
};