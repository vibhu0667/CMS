const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    bookTime: {
        type: String, // Store time in "HH:MM AM/PM" format
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
