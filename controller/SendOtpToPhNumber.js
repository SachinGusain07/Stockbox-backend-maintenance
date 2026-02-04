import axios from 'axios';
import SendOtpToPhNumber from '../models/SendOtpToPhNumber.js'; // Model import (your schema)

const otpStore = {}; // Temporary in-memory storage for OTPs
const OTP_EXPIRY_TIME = 3 * 60 * 1000; // 3 minutes in milliseconds
const MAX_INVALID_ATTEMPTS = 3; // Max invalid attempts before expiration

// Generate OTP
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString(); // 6-digit OTP
}

// Send OTP using your given structure
async function sendOTP(phoneNumber, otp) {
    console.log(`Sending OTP ${otp} to ${phoneNumber}`);
    try {
        // const response = await axios.post('http://162.55.22.113/api/pushsmsjson.php', {
        //     "Authorization": {
        //         "User": 't5bholak',   // Replace with your actual User
        //         "Key": '010Sg19G40UKMXdThBXb', // Replace with your actual Key
        //     },
        //     "Data": {
        //         "Sender": 'STOKBX',
        //         "Message": `${otp} is your verification code to activate your account with Stockbox, please do not share it with anyone. STOCKBOX TECHNOLOGIES Pvt Ltd.`,
        //         "Flash": 1,
        //         "ReferenceId": '1564879',
        //         "EntityId": '1601891165424815864',
        //         "TemplateId": '1607100000000214861',
        //         "Mobile": [phoneNumber]
        //     }
            
              
        // });
        const response = await axios.post('http://14.97.212.62/Api/smsapi/SendSms',
            {
    "UserId": "t5bholak",
    "Password": "M0yz!RnC",
    "SenderID": "STOKBX",
    "Phno": `${phoneNumber}`,
    "Msg": `${otp} is your verification code to activate your account with Stockbox, please do not share it with anyone. STOCKBOX TECHNOLOGIES PVt Ltd.`,
    "EntityID": "1601891165424815864",
    "TemplateID": "1607100000000214861",
    "DlrUrl": "http://example.com/dlr",
    "FlashMsg": 0,
    "CampaignName": "Test Campaign"
}
        );

        console.log('OTP sent successfully:', response.data);
    } catch (error) {
        console.error('Failed to send OTP:',error.response || error.response?.data || error.message);
        throw new Error('Failed to send OTP');
    }
}

// Step 1: Request OTP
export const requestOTP = async (req, res) => {
    const { phoneNumber, name } = req.body;

    if (!phoneNumber || !name) {
        return res.status(400).json({ message: 'Phone number and name are required' });
    }

    const otp = generateOTP();
    const expirationTime = Date.now() + OTP_EXPIRY_TIME; // Set OTP expiration time
    otpStore[phoneNumber] = { otp, name, expirationTime, invalidAttempts: 0 };

    try {
        await sendOTP(phoneNumber, otp);
        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};

// Step 2: Verify OTP and create user
export const verifyOTP = async (req, res) => {
    const { phoneNumber, otp } = req.body;

    const record = otpStore[phoneNumber];

    if (!record) {
        return res.status(400).json({ message: 'No OTP requested for this phone number' });
    }

    // Check if OTP is expired
    if (Date.now() > record.expirationTime) {
        delete otpStore[phoneNumber]; // Remove expired OTP
        return res.status(400).json({ message: 'OTP has expired' });
    }

    // Check if too many invalid attempts have been made
    if (record.invalidAttempts >= MAX_INVALID_ATTEMPTS) {
        delete otpStore[phoneNumber]; // Remove OTP after too many invalid attempts
        return res.status(400).json({ message: 'Too many invalid attempts. OTP expired' });
    }

    // Check if OTP matches
    if (record.otp !== otp) {
        // Increment invalid attempt counter
        otpStore[phoneNumber].invalidAttempts += 1;
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP matched, proceed to create user
    try {
        const existingUser = await SendOtpToPhNumber.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(200).json({ message: 'User already exists' });
        }

        const newUser = new SendOtpToPhNumber({ name: record.name, phoneNumber });
        await newUser.save();

        // Cleanup temp storage
        delete otpStore[phoneNumber];

        // Set the cookie indicating successful verification
        res.cookie('isVerified', true, {
            httpOnly: true, // Cookie accessible only by the server
            maxAge: 24 * 60 * 60 * 10000, // 1 day
        });

        res.json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await SendOtpToPhNumber.find().sort({ createdAt: -1 }); // -1 for descending order (newest first)
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Delete a user by ID
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await SendOtpToPhNumber.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
