const Enquiry = require("../models/enqModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");


//Create a Product Enquiry
const createEnquiry = asyncHandler(async (req, res) => {
    try {
        const newEnquiry = await Enquiry.create(req.body);
        res.json(newEnquiry);

    } catch (error) {
        throw new Error(error);
    }
})

//Update a Product Enquiry
const updateEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const newEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(newEnquiry);

    } catch (error) {
        throw new Error(error);
    }
})
const deleteEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const newEnquiry = await Enquiry.findByIdAndDelete(id);
        res.json(newEnquiry);

    } catch (error) {
        throw new Error(error);
    }
})
//Fetch a Enquiry
const getaEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const newEnquiry = await Enquiry.findById(id)
        res.json(newEnquiry);

    } catch (error) {
        throw new Error(error);
    }
})
//Fetch all Enquiry
const getAllEnquiry = asyncHandler(async (req, res) => {
    try {
        const newEnquiry = await Enquiry.find();
        res.json(newEnquiry);

    } catch (error) {
        throw new Error(error);
    }
})

module.exports = {
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
    getaEnquiry,
    getAllEnquiry,
};