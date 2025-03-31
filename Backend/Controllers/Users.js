import Users from '../Models/Users.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Validate input
    if (!(firstName && lastName && email && password)) {
        return res.status(400).json({ message: 'All input is required' });
    }

    try {
        // Check if the user already exists
        const oldUser = await Users.findOne({ email });
        if (oldUser) {
            return res.status(409).json({ message: 'User already exists. Please login' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the new user
        const newUser = new Users({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        // Respond with success
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error saving user:', error.message);
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, password } = req.body;

    // Validate input
    if (!(firstName && lastName && email)) {
        return res.status(400).json({ message: 'All input is required' });
    }

    try {
        if (password) {
            const saltRounds = 10;
            req.body.password = await bcrypt.hash(password, saltRounds);
        }

        // Update the user
        await Users.findByIdAndUpdate(id, {
            firstName,
            lastName,
            email,
            password: req.body.password,
        }, { new: true, runValidators: true });

        // Respond with success
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ error: error.message });
    }
}

export const registerWithUsername = async (req, res) => {
    const { id, email } = req.params;
    const { username, category } = req.body;
    
    // Validate input
    if(!(username && category)) {
        return res.status(400).json({ message: 'All input is required' });
    }

    try {
        // Update the user
        const user = await Users.findByIdAndUpdate(id, { username, category }, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        //Generate access token
        const accessToken = jwt.sign(
            { id: user._id, email, username },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: '24h' }
        )
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        // Respond with success
        res.status(200).json({ message: 'User updated successfully', accessToken });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ error: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!(email && password)) {
        return res.status(400).send('All input is required');
    }

    try {
        // Find user by email or username
        const user = await Users.findOne({ $or: [{ email }, { username: email }] });
        if (!user) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate new access token
        const accessToken = jwt.sign(
            { id: user._id, email: user.email, username: user.username }, // Include all required fields
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: '24h' }
        );

        // Set token in HTTP-only cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        // Respond with success
        return res.status(200).json({
            message: `${user.firstName}, your login is successful`,
            accessToken, // Include the token in the response
        });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ error: error.message });
    }
};


export const getUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await Users.findById(id).select('-password'); 
      // ^ exclude password or keep it if you really need it
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error.message);
      return res.status(500).json({ error: error.message });
    }
  };
  

// Logout -> Clear the Access Token
export const logout = async (req, res) => {
    try {
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
        });
        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAvailability = async (req, res) => {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const user = await Users.findById(req.user._id).select('availability');
        if (!user) return res.status(404).json({ error: 'User not found' });

        console.log("Fetched availability:", user.availability); // Debug log
        res.status(200).json({ availability: user.availability });
    } catch (err) {
        console.error("Error fetching availability:", err.message);
        res.status(500).json({ error: err.message });
    }
};

export const updateAvailability = async (req, res) => {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { availability } = req.body;

    // Ensure availability is provided in the request body
    if (!availability) {
        return res.status(400).json({ message: 'Availability is required' });
    }
    if (!availability || typeof availability !== 'object' || Array.isArray(availability)) {
        return res.status(400).json({ message: 'Invalid availability format' });
    }

    try {
        console.log("Updating availability for user:", req.user._id); 
        console.log("New availability data:", availability);

        const user = await Users.findByIdAndUpdate(
            req.user._id,
            { availability },
            { new: true, runValidators: true }
        ).select('availability');

        res.status(200).json({ message: 'Availability updated', availability: user.availability });
    } catch (err) {
        console.error("Error updating availability:", err.message);
        res.status(500).json({ error: err.message });
    }
};