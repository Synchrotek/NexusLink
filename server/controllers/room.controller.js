const Room = require('../models/room.model.js');

exports.createNewRoom = async (req, res) => {
    const { roomId, creator, name, description } = req.body;
    await Room.findOne({ roomId }).then(async (existingRoom) => {
        if (existingRoom) {
            return res.status(200).json({
                message: 'ROOM_EXISTS'
            });
        }
        const newRoom = new Room({
            roomId, creator: creator, name, description,
            files: [
                {
                    fileId: 1, filename: 'Main1',
                    fileContent: '// Hello world 1', language: 'javascript'
                },
            ]
        });
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
        return res.status(200).json(allRooms || []);
    }).catch((err) => {
        console.log('FETCHING ALL ROOMS IN DATABASE ERROR', err);
        return res.status(500).json({
            error: 'Error fetching rooms. Please try again'
        });
    })
}

exports.updateFilesInRoom = async (req, res) => {
    const { roomId, files } = req.body;
    await Room.findOne({ roomId }).then(async (existingRoom) => {
        if (!existingRoom) {
            return res.status(400).json({
                error: 'This room does not exists'
            });
        }

        await Room.findByIdAndUpdate(
            { _id: existingRoom._id },
            { files }
        ).then(result => {
            res.status(200).json({
                message: 'Filelist updated successfully'
            })
        }).catch(err => {
            console.log('UPDATING FILES LIST ERROR', err)
            return res.status(500).json({
                error: 'UPDATING FILES LIST ERROR'
            });
        })
    }).catch((err) => {
        console.log('FINDING ROOM IN DATABASE ERROR', err);
        return res.status(400).json({
            error: 'Error FINDING room. Please try again'
        });
    })
}

exports.getAllFilesInRoom = async (req, res) => {
    const { roomId } = req.body;
    await Room.findOne({ roomId }).then(async (existingRoom) => {
        if (!existingRoom) {
            return res.status(400).json({
                error: 'This room does not exists or the creator dleteed this room.'
            });
        }
        const roomDetails = existingRoom;
        return res.status(200).json(roomDetails);
    }).catch((err) => {
        console.log('FETCHING ALL FILES IN A ROOM FROM DATABASE ERROR', err);
        return res.status(400).json({
            error: 'Error fetching files from room. Please try again'
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
        if (givenCreatorId.toString() !== existingRoom.creator.creatorId.toString()) {
            return res.status(400).json({
                error: 'Only the one who created can delete the room'
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