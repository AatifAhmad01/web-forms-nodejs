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
    const { answers = [], creator, email } = req.body;

    try {

        if (!email) {
            throw new ApiError(400, 'Email is required');
        }
        if (answers.length === 0) {
            throw new ApiError(400, 'Answers are required');
        }

        const previousResponse = await FormResponse.findOne({ formId, email });

        if (previousResponse) {
            throw new ApiError(400, 'You have already submitted a response to this form');
        }

        const response = await FormResponse.create({ formId, answers, creator: creator || 'Anonymous', email });

        if (!response) {
            throw new ApiError(500, 'Failed to submit form');
        }

        res.status(201).json(
            new ApiResponse(201, response, 'Response submitted successfully')
        );

    } catch (error) {
        console.log(error)
        throw new ApiError(error.statusCode || 500, error.message || 'Failed to submit form');
    }
});

const getForms = asyncHanlder(async (_, res) => {

    // For each form, add a 'noOfResponses' property indicating the number of responses
    const forms = await Form.aggregate([
        {
            $lookup: {
                from: "formresponses",
                localField: "_id",
                foreignField: "formId",
                as: "responses"
            }
        },
        {
            $addFields: {
                noOfResponses: { $size: "$responses" }
            }
        },
        {
            $project: {
                responses: 0 // exclude the responses array from the result
            }
        }
    ]);

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

    const form = await Form.findById(formId);

    if (!form) {
        throw new ApiError(404, 'Form not found');
    }

    const responses = await FormResponse.find({ formId });

    const data = {
        form: form._doc,
        responses: responses
    }

    res.status(200).json(
        new ApiResponse(200, data, 'Responses fetched successfully')
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