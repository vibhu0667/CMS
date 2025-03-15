const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  role: {
    type: String,
    default:"user",
    enum: ['user', 'admin', 'doctor'],
    required: true, // Ensure role is required
  },
});

const Role = mongoose.model('role', roleSchema);
module.exports = Role;
