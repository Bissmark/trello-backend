const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const SALT_LENGTH = 12;

const getGoogleCallback = () => {
    if (process.env.NODE_ENV === 'production') {
        return process.env.GOOGLE_CALLBACK_PROD;
    }
    return process.env.GOOGLE_CALLBACK_DEV;
};

const signup = async (req, res) => {
    try {
        // Check if the email is already taken
        const userInDatabase = await User.findOne({ email: req.body.email });
        if (userInDatabase) {
            return res.json({error: 'Username already taken.'});
        }
        // Create a new user with hashed password
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, SALT_LENGTH)
        })
        const token = jwt.sign({ email: user.email, _id: user._id }, process.env.SECRET);
        res.status(201).json({ user, token });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            const token = jwt.sign({ name: user.name, email: user.email, _id: user._id }, process.env.SECRET);
            res.status(200).json({ name: user.name, token });
        } else {
            res.status(401).json({ error: 'Invalid email or password.' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const googleAuth = async (req, res) => {
    try {
        console.log('Google auth request body:', req.body); // Debug log
        
        const { email, name, picture, sub: googleId } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required from Google' });
        }

        console.log(`Google login attempt for: ${email}, name: ${name}`); // Debug log

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            // User exists, update Google ID if not set
            if (!user.googleId && googleId) {
                user.googleId = googleId;
                await user.save();
            }
            console.log('Existing user found:', user.email); // Debug log
        } else {
            // Create new user for Google login
            console.log('Creating new user for Google login'); // Debug log
            user = await User.create({
                name: name || '',
                email,
                googleId: googleId || '',
                password: bcrypt.hashSync('google_oauth_user', SALT_LENGTH), // Dummy password
                avatar: picture || ''
            });
            console.log('New user created:', user.email); // Debug log
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                name: user.name, 
                email: user.email, 
                _id: user._id,
                googleId: user.googleId 
            }, 
            process.env.SECRET
        );

        console.log('JWT token generated for user:', user.email); // Debug log

        res.status(200).json({ 
            name: user.name, 
            email: user.email,
            _id: user._id,
            avatar: user.avatar,
            token 
        });

    } catch (error) {
        console.error('Google auth error:', error);
        res.status(400).json({ error: error.message });
    }
};

// Use the dynamic callback URL wherever you need it
const googleCallback = getGoogleCallback();

module.exports = {
    signup,
    login,
    googleCallback, // Export it if you need it in other files
    googleAuth
};