const { uploadOnCloudinary } = require('../utils/cloudinary.js')

exports.uploadFileToCloudinary = async (req, res) => {
    try {
        const attachmentLocalPath = req.files?.attachment[0].path;
        if (!attachmentLocalPath) {
            res.status(400).json({
                error: 'Attachment is not uploaed'
            })
        }
        const attachment = await uploadOnCloudinary(attachmentLocalPath);
        if (!attachment) {
            res.status(400).json({
                error: 'Attachment file not uploaed'
            })
        }
        res.status(201).json(attachment);
    } catch (err) {
        console.log('UPLOADING ATTACHMENT TO CLOUDINARY ERROR', err);
        return res.status(400).json({
            error: 'Error uploading attachment to cloudinary.'
        });
    }
}