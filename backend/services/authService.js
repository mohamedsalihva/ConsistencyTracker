import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const registerUser = async (name, email, password) => {
    const userExists = await User.findOne({
        email
    });

    if (userExists) throw new Error("user already Exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    return user;
};



export const loginUser = async (email, password) => {
    const user = await User.findOne({
        email
    });

    if (!user) throw new Error("invalid email");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new Error("invalid password");

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    return {
        user,
        token
    };
};