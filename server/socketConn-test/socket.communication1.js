const SOCKET_ACTIONS = require('./SocketActions.js');

const socketCommunication1 = (io) => {
    const sokcetIdToUsersMap = {};
    const roomIdToCodeMap = {};

    const getUsersInRoom = async (roomId, io) => {
        const socketList = await io.in(roomId).allSockets();
        const userList = [];
        socketList.forEach(each => {
            (each in sokcetIdToUsersMap) &&
                userList.push(sokcetIdToUsersMap[each].username)
        });

        return userList;
    };

    const updateUserListAndCodeMap = async (io, socket, roomId) => {
        socket.in(roomId).emit(SOCKET_ACTIONS.DISCONNECTED, {
            username: sokcetIdToUsersMap[socket.id]
        })

        // update the user list
        delete sokcetIdToUsersMap[socket.id];

        const userList = await getUsersInRoom(roomId, io);
        socket.in(roomId).emit(SOCKET_ACTIONS.CLIENTLIST_UPDATE, { userList });

        userList.length === 0 && delete roomIdToCodeMap[roomId];
    }

    io.on('connection', (socket) => {
        socket.on(SOCKET_ACTIONS.JOIN, async ({ roomId, username }) => {
            sokcetIdToUsersMap[socket.id] = { username };
            socket.join(roomId);

            const userList = await getUsersInRoom(roomId, io);

            // for other user, update the client list ---------------
            socket.in(roomId).emit(SOCKET_ACTIONS.CLIENTLIST_UPDATE, { userList });

            // for other user, update the client list ---------------
            io.to(socket.id).emit(SOCKET_ACTIONS.CLIENTLIST_UPDATE, { userList });

            // send the latest code changes to this user 
            // when joined to existing room -------------------------
            if (roomId in roomIdToCodeMap) {
                io.to(socket.id).emit(SOCKET_ACTIONS.SYNC_CODE, {
                    files: roomIdToCodeMap[roomId].files // change here
                })
            }

            // alert other users in room that new user joined -------
            socket.in(roomId).emit(SOCKET_ACTIONS.JOINED, { username });
        });

        socket.on(SOCKET_ACTIONS.CODE_CHANGE, ({ roomId, files }) => {
            if (roomId in roomIdToCodeMap) {
                roomIdToCodeMap[roomId]['files'] = files
            } else {
                roomIdToCodeMap[roomId] = { files }
            }
        });

        socket.on(SOCKET_ACTIONS.SYNC_CODE, ({ roomId }) => {
            if (roomId in roomIdToCodeMap) {
                socket.in(roomId).emit(SOCKET_ACTIONS.CODE_CHANGE, {
                    files: roomIdToCodeMap[roomId].files
                })
            }
        });

        socket.on('disconnecting', (reason) => {
            socket.rooms.forEach(eachRoom => {
                if (eachRoom in roomIdToCodeMap) {
                    updateUserListAndCodeMap(io, socket, eachRoom);
                }
            })
        });

        socket.on('disconnect', () => {
            console.log(`user disconnected - ${socket.id}`);
        });
    });
};

module.exports = socketCommunication1;