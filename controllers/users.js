const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const SALT_LENGTH = 12;

const signup = async (req, res) => {
    try {
        // Check if the email is already taken
        const userInDatabase = await User.findOne({ email: req.body.email });
        if (userInDatabase) {
            return res.json({error: 'Username already taken.'});
        }
        // Create a new user with hashed password
        const user = await User.create({
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
        console.log(user);
		if (user && bcrypt.compareSync(req.body.password, user.password)) {
			const token = jwt.sign({ email: user.email, _id: user._id }, process.env.SECRET);
			res.status(200).json({ token });
		} else {
			res.status(401).json({ error: 'Invalid email or password.' });
		}
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}
module.exports = {
    signup,
    login,
    // googleLogin
};