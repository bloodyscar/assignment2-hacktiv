const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// Secret Key for JWT (should be stored securely)
const secretKey = 'your-secret-key';

// Read user data from users.json file
const usersData = fs.readFileSync('user.json', 'utf-8');
const users = JSON.parse(usersData);

// Read user data from users.json file
const teacherData = fs.readFileSync('teacher.json', 'utf-8');
const teacher = JSON.parse(teacherData);


// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Create JWT token
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Authenticated Route
app.get('/get-teachers', (req, res) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token.' });
        }

        // Token valid, proceed with operations requiring authentication here
        res.json({ message: 'Berhasil mengambil data', teacher: teacher });
    });
});

// Server Listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
