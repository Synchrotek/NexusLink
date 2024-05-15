const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return { status: 'failed', error: 'localFilePath undefined' };
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
            folder: 'nexuslink',
        });
        console.log(response);
        fs.unlinkSync(localFilePath);
        return { status: 'success', response };
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log(error);
        return { status: 'failed', error };
    }
}

module.exports = { uploadOnCloudinary };