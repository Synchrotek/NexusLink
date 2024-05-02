const Room = require('../models/room.model.js');

exports.createNewRoom = async (req, res) => {
    const { roomId, creatorId } = req.body;
    await Room.findOne({ roomId }).then(async (existingRoom) => {
        if (existingRoom) {
            return res.status(200).json({
                message: 'ROOM_EXISTS'
            });
        }
        const newRoom = new Room({ roomId, creatorId });
        console.log(newRoom);
        await newRoom.save().then(result => {
            return res.status(201).json({
                message: 'New room created.'
            });
        }).catch(err => {
            console.log('SAVE ROOM IN DATABASE ERROR', err);
            return res.status(400).json({
                error: 'Error saving room in our databse. Please try  again'
            });
        })
    }).catch((err) => {
        console.log('FINDING ROOM IN DATABASE ERROR', err);
        return res.status(400).json({
            error: 'Error creating room. Please try again'
        });
    })
}

exports.getAllRooms = async (req, res) => {
    await Room.find().then((allRooms) => {
        return res.status(201).json(allRooms || []);
    }).catch((err) => {
        console.log('FETCHING ALL ROOMS IN DATABASE ERROR', err);
        return res.status(400).json({
            error: 'Error fetching rooms. Please try again'
        });
    })
}

exports.deleteARoom = async (req, res) => {
    const { roomId, givenCreatorId } = req.body;
    await Room.findOne({ roomId }).then(async (existingRoom) => {
        if (!existingRoom) {
            return res.status(400).json({
                error: 'Room (requested for deletion) does not exist'
            });
        }
        if (givenCreatorId.toString() !== existingRoom.creatorId.toString()) {
            return res.status(400).json({
                error: 'Only the one whi createdcan delete the room'
            });
        }
        await Room.deleteOne({ roomId }).then(result => {
            return res.status(201).json({
                message: 'Room dleted successfully.'
            });
        }).catch(err => {
            console.log('ROMM DELETE IN DATABASE ERROR', err);
            return res.status(400).json({
                error: 'Error DELETING room in our databse. Please try again'
            });
        })
    }).catch((err) => {
        console.log('FINDING ROOM IN DATABASE ERROR', err);
        return res.status(400).json({
            error: 'Error deleting room. Please try again'
        });
    })
}