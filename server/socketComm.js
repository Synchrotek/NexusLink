const socketListen = (io) => {

    console.log('socketListen running');

    const userSocketMap = {};

    const getAllConnectedClient = (roomId, userDeatils) => {
        return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
                userDeatils,
            }
        });
    }

    io.on('connection', (socket) => {

        // Listen for events from clients -------------------
        socket.on('join', async ({ roomId, userDeatils }) => {
            // console.log(`${username} Joined - ${socket.id}`);
            userSocketMap[socket.id] = userDeatils.username;
            socket.join(roomId);
            const connectedUsers = getAllConnectedClient(roomId, userDeatils);
            connectedUsers.forEach(({ socketId }) => {
                io.to(socketId).emit('joined', {
                    connectedUsers,
                    username: userDeatils.username,
                    socketId: socket.id
                })
            })
        });

        // Editor related Events -------------------------------========
        socket.on('code-change', ({ roomId, files, fileId }) => {
            socket.in(roomId).emit('code-change', { files, fileId });
        })

        socket.on('sync-code', ({ files, socketId }) => {
            io.to(socketId).emit('code-change', { files });
        })

        // Editor related Events -------------------------------========
        socket.on('message', ({ messageObject, roomId, senderObject }) => {
            const connectedUsers = getAllConnectedClient(roomId);
            connectedUsers.forEach(({ socketId }) => {
                io.to(socketId).emit('send-message', {
                    messageObject, senderObject
                })
            })
        })


        // Handle disconnection of an socketId -------------------------
        socket.on('disconnecting', () => {
            const rooms = [...socket.rooms];
            rooms.forEach((roomId) => {
                socket.in(roomId).emit('disconnected', {
                    socketId: socket.id,
                    username: userSocketMap[socket.id],
                });
            })
            // socket.emit('selfDisconnected');
            // socket.broadcast.emit('leave', { user: `${userSocketMap[socket.id]}`, message: ` has left`, id: `${socket.id}` });
            // console.log(`${userSocketMap[socket.id]} left the Chat`); //delete
            delete userSocketMap[socket.id];
            socket.leave();
        })

        // Handle disconnections
        socket.on('disconnect', () => {
            console.log(`user disconnected - ${socket.id}`);
        });
    });
};

module.exports = socketListen