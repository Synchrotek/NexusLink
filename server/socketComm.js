const socketListen = (io) => {

    console.log('socketListen running');

    const userSocketMap = {};

    const getAllConnectedClient = (roomId) => {
        return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            }
        });
    }

    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);

        // Listen for events from clients -------------------
        socket.on('join', ({ roomId, username }) => {
            userSocketMap[socket.id] = username;
            socket.join(roomId);
            const clients = getAllConnectedClient(roomId);
            clients.forEach(({ socketId }) => {
                io.to(socketId).emit('joined', {
                    clients, username, socketId: socket.id
                })
            })
        });

        socket.on('code-change', ({ roomId, editorCode }) => {
            socket.in(roomId).emit('code-change', { editorCode });
        })

        socket.on('sync-code', ({ editorCode, socketId }) => {
            io.to(socketId).emit('code-change', { editorCode });
        })

        // Handle disconnection of an socketId
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

        // // Handle disconnections
        // socket.on('disconnect', () => {
        //     console.log('A user disconnected');
        // });
    });
};

module.exports = socketListen