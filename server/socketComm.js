const socketListen = (io) => {

    console.log('socketListen running');

    const userSocketMap = {};
    const roomId_to_code_Map = {};

    const getAllConnectedClient = (roomId) => {
        return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            }
        });
    }

    io.on('connection', (socket) => {

        // Listen for events from clients -------------------
        socket.on('join', async ({ roomId, username }) => {
            console.log(`${username} Joined - ${socket.id}`);
            userSocketMap[socket.id] = username;
            socket.join(roomId);
            const connectedUsers = getAllConnectedClient(roomId);
            connectedUsers.forEach(({ socketId }) => {
                io.to(socketId).emit('joined', {
                    connectedUsers, username, socketId: socket.id
                })
            })
        });

        socket.on('code-change', ({ roomId, editorCode }) => {
            socket.in(roomId).emit('code-change', { editorCode });
        })

        socket.on('sync-code', ({ editorCode, socketId }) => {
            io.to(socketId).emit('code-change', { editorCode });
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