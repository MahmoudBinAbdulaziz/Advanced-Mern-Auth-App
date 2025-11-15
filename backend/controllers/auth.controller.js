import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import {user} from '../models/user.model.js';
import { generateVerificationToken } from '../utils/generate-verification.js';
import { generateTokenAndSetCookies } from '../utils/generateTokenAndSetCookies.js';
import { sendVerificationEmail } from '../mailtrap/emails.js';
import { sendVerificationSuccessEmail } from '../mailtrap/emails.js';
import { sendPasswordResetEmail } from '../mailtrap/emails.js';
import {sendResetSuccessEmail} from '../mailtrap/emails.js';
export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    try{
        const existingUser = await user.findOne({ email });
        if (existingUser) {
          return res.status(409).json({ message: 'User already exists' });
        }
        else {
            // console.log(password);
            const hashedPassword =bcrypt.hashSync(password, 10);
            const verificationToken = generateVerificationToken();
            const verificationTokenExpires = Date.now() + 3600000*24; // 24 hours
            const newUser = new user({
                name,
                email,
                password:hashedPassword,
                verificationToken,
                verificationTokenExpires
            });
            await newUser.save();
            //generate jwt token and send email logic can be added here
            generateTokenAndSetCookies(res,newUser._id);
            await sendVerificationEmail(newUser.email, verificationToken);
            return res.status(201).json({ message: 'User signed up successfully' , user: {...newUser._doc, password:undefined}});
        }

    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ message: 'Internal server error' } );
    }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const curUser = await user.findOne({ email });
    if (!curUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await curUser.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    generateTokenAndSetCookies(res,curUser._id);
    curUser.lastLogin = Date.now();
    await curUser.save();
    return res.status(200).json({ message: 'User signed in' , user: {...curUser._doc, password:undefined}} );
  } catch (error) {
    console.error('Error during signin:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const logout = async (req, res) => {
    // Logout logic here
    res.clearCookie('token');
    res.status(200).json({ message: 'User logged out' });
}

export const verifyEmail = async (req, res) => {
    const { verificationCode } = req.body;
    if (!verificationCode) {
      return res.status(400).json({ message: 'Verification code is required' });
    }
    try {
      const curUser = await user.findOne({ verificationToken: verificationCode, verificationTokenExpires: { $gt: Date.now() } });
      if (!curUser) {
        return res.status(404).json({ message: 'User not found or verification code expired' });
      }
      curUser.isVerified = true;
      curUser.verificationToken = undefined;
      curUser.verificationTokenExpires = undefined;
      await curUser.save();
      //send verification success email logic
      await sendVerificationSuccessEmail(curUser.email, curUser.name);

      return res.status(200).json({
        message: 'Email verified successfully',
        user: { ...curUser._doc, password: undefined }
      });
    } catch (error) {
      console.error('Error during email verification:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
};

export const forgotPassword = async (req, res) => {
    // Forgot password logic here
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    try {
      const curUser = await user.findOne({ email });
      if (!curUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Generate reset token and send email logic can be added here
      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetTokenExpires = Date.now() + 3600000; // 1 hour
      curUser.resetPasswordToken = resetToken;
      curUser.resetPasswordExpires = resetTokenExpires;
      await curUser.save();
      await sendPasswordResetEmail(curUser.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

      return res.status(200).json({ message: 'Password reset link sent to email' });
    } catch (error) {
      console.error('Error during forgot password:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
};
export const resetPassword = async (req, res) => {
    // Reset password logic here
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }

    try {
      const curUser = await user.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!curUser) {
        return res.status(404).json({ message: 'Invalid or expired token' });
      }

      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      curUser.password = hashedPassword;
      curUser.resetPasswordToken = undefined;
      curUser.resetPasswordExpires = undefined;
      await curUser.save();
      
      await sendResetSuccessEmail(curUser.email, curUser.name);
      return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error during password reset:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
};
export const checkAuth = async (req, res) => {
  try {
    // console.log(req.user._id);
    const curUser = await user.findById(req.user._id).select('-password');
    if (!curUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User is authenticated', user:curUser });
  } catch (error) {
    console.error('Error during auth check:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};