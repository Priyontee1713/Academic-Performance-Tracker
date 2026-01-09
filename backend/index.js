const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connection using the .env variable
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ Connection error:", err));

// UPDATED SCHEMA: Added username field
const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    username: { type: String, required: true, unique: true }, // New Field
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}));

// UPDATED REGISTER ROUTE
app.post('/api/register', async (req, res) => {
    try {
        const { name, username, email, password } = req.body; // Explicitly pull username
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({ 
            name, 
            username, 
            email, 
            password: hashedPassword 
        });
        
        await newUser.save();
        res.status(201).json({ message: "Success" });
    } catch (err) { 
        res.status(400).json({ error: "Username or Email already exists" }); 
    }
});

// UPDATED LOGIN ROUTE: Now searches by username instead of email
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username }); // Find by username
        
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, name: user.name, username: user.username });
        } else { 
            res.status(400).json({ error: "Invalid Credentials" }); 
        }
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));