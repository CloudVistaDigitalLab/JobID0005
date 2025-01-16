const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminModel = require("../Models/Admin");


const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await AdminModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User is already exist, you can login', success: false });
        }
        const adminModel = new AdminModel({ name, email, password });
        adminModel.password = await bcrypt.hash(password, 10);
        await adminModel.save();
        res.status(201)
            .json({
                message: "Signup successfully",
                success: true
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await AdminModel.findOne({ email });
        const errorMsg = 'Auth failed email or password is wrong';
        if (!admin) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, admin.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: admin.email, _id: admin._id, name: admin.name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                email,
                name: admin.name
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}

/*const getUserById = async (req, res) => {
    try {
        // Extract user ID from request parameters
        const userId = req.params.id;

        // Validate the ID if necessary (e.g., for MongoDB ObjectId)
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
        }

        // Fetch user from the database
        const user = await UserModel.findById(userId);

        // Check if user exists
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }

        // Return user data
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};*/

module.exports = {
    signup,
    login
}