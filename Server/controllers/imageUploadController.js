import User from '../database/models/userSchema.js';
import cloudinary from '../config/cloudinary.config.js';

export const uploadImage = async (req, res) => {
    const { userId } = req.user;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).send({
                error:true,
                message:'User not found'
            });
        }

        // Delete existing image on Cloudinary if it exists
        if (user.imageUrl) {
            const publicId = user.imageUrl.split('/').pop().split('.')[0];
            console.log(publicId);
            await cloudinary.uploader.destroy(`displayPic/${publicId}`);
        }

        // Update user's imageUrl with the new image URL
        user.imageUrl = req.file.path;
        await user.save();

        res.send({
            error: false,
            message: "Image Uploaded Successfully",
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).send({
            error:true,
            message:'Server error'
        });
    }
};