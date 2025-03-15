require("dotenv").config(); // Add this at the top
const nodemailer = require("nodemailer");

const sendOTPEmail = async (email, otp) => {  
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD, 
            },
        });

        const mailOptions = {
            from: `"Clinic Management" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: "Doctor Registration OTP",
            text: `Your OTP for doctor registration is: ${otp}. It is valid for 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
    } catch (error) {
        console.error("Error sending OTP email:", error);
    }
};

const sendDoctorCredentialsEmail = async (email, password) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });
  
      const mailOptions = {
        from: "Clinic Management <no-reply@clinic.com>",
        to: email,
        subject: "Your Doctor Account Credentials",
        text: `Welcome to the Clinic Management System!\n\nYour login credentials:\nEmail: ${email}\nPassword: ${password}\n\nPlease login and change your password.`,
      };
  
      await transporter.sendMail(mailOptions);
      console.log(`Doctor credentials sent to ${email}`);
    } catch (error) {
      console.error("Error sending credentials email:", error);
    }
  };

module.exports = { sendOTPEmail,sendDoctorCredentialsEmail };
