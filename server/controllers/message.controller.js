const { ObjectId } = require('mongodb');
const { uploadOnCloudinary } = require('../utils/cloudinary.js')
const { sampleMessageData } = require('../constants/sampleData.js')
const Message = require('../models/message.model.js')

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

exports.pushMessagesIntoDB = async (req, res) => {
    try {
        const { allMessages } = req.body;
        if (allMessages.length <= 0) {
            return res.status(400).json({
                error: 'No messages provided in request.'
            });
        }
        await Message.insertMany(allMessages).then(result => {
            return res.status(201).json({
                message: 'Given messages inserted in DB.'
            });
        }).catch((err) => {
            console.log('MESSAGES SAVING TO MONGODB ERROR DB', err);
            return res.status(400).json({
                error: 'Error while saving messages in mongodb.'
            });
        })
    } catch (err) {
        console.log('MESSAGES SAVING TO MONGODB ERROR', err);
    }
}

exports.getAllMessages = async (req, res) => {
    try {
        const { roomId } = req.body;
        await Message.find({ roomId }).then((allDbFetchedMessages) => {
            return res.status(201).json(allDbFetchedMessages);
        }).catch((err) => {
            console.log('MESSAGES FETCHING FROM MONGODB ERROR DB', err);
            return res.status(400).json({
                error: 'Error while fetching messages in mongodb.'
            });
        })
    } catch (err) {
        console.log('MESSAGES FETCHING FROM MONGODB ERROR', err);
    }
}


// const { token } = req.body;
// if (token) {
//     jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (err, decoded) {
//         const { name, email, password, profilePic, bio } = jwt.decode(token);
//         User.findOne({ email }).then(async (existingUser) => {
//             if (existingUser) {
//                 return res.status(400).json({
//                     error: 'Account is already activated! Pleae SingIn.'
//                 });
//             }
//             if (err) {
//                 // console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err);
//                 return res.status(401).json({
//                     error: 'Expired link. Please Singup again'
//                 })
//             }
//             const user = new User({ name, email, password, profilePic, bio });
//             user.save().then(result => {
//                 return res.json({
//                     message: 'Signup Activation success. Please Singin'
//                 });
//             }).catch(err => {
//                 console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err);
//                 return res.status(400).json({
//                     error: 'Error saving user in our databse. Try Singup again'
//                 });
//             })
//         });
//     });