const Doctor = require("../models/doctor.model");
const Patient = require("../models/user.model");

const bookAppointment = async (req, res) => {
    try {
        const { name, doctorId, bookTime } = req.body;

        // Validate input
        if (!name || !doctorId || !bookTime) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Fetch doctor details
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found." });
        }

        // Convert time to 24-hour format
        const to24Hour = (t) => {
            const [hour, minute, period] = t.match(/(\d+):(\d+) (AM|PM)/).slice(1);
            return `${period === "PM" && hour !== "12" ? parseInt(hour) + 12 : hour}:${minute}`;
        };

        const requestTime24 = to24Hour(bookTime);
        const morningStart = to24Hour(doctor.workingHours.morning.start);
        const morningEnd = to24Hour(doctor.workingHours.morning.end);
        const eveningStart = to24Hour(doctor.workingHours.evening.start);
        const eveningEnd = to24Hour(doctor.workingHours.evening.end);

        // Check if within working hours
        const isWithinWorkingHours = 
            (requestTime24 >= morningStart && requestTime24 <= morningEnd) ||
            (requestTime24 >= eveningStart && requestTime24 <= eveningEnd);

        if (!isWithinWorkingHours) {
            return res.status(400).json({ message: "Doctor is not available at this time. Please select another time." });
        }

        // Check if within break time
        for (const breakSlot of doctor.breakTime) {
            const breakStart = to24Hour(breakSlot.start);
            const breakEnd = to24Hour(breakSlot.end);

            if (requestTime24 >= breakStart && requestTime24 <= breakEnd) {
                return res.status(400).json({ message: "Doctor is on a break at this time. Please select another time." });
            }
        }

        // Check if doctor already has an appointment at this time
        const existingAppointment = await Patient.findOne({
            doctorId: doctorId,
            bookTime: bookTime
        });

        if (existingAppointment) {
            return res.status(400).json({ message: "Doctor already has an appointment at this time. Please select another time." });
        }

        // Book the appointment
        const newAppointment = await Patient.create({
            name,
            doctorId,
            bookTime
        });

        return res.status(201).json({
            message: "Appointment booked successfully!",
            appointment: newAppointment
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
module.exports = {
    bookAppointment
}
