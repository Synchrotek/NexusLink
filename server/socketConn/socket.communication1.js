const SOCKET_ACTIONS = require('./SocketActions.js');

const socketCommunication1 = (io) => {
    const sokcetIdToUsersMap = {};
    const roomIdToCodeMap = {};

    io.on('connection', (socket) => {
        socket.on(SOCKET_ACTIONS.JOIN, async ({ roomId, username }) => {
            sokcetIdToUsersMap[socket.id] = { username };
            socket.join(roomId);
        })
    });
};

module.exports = socketCommunication1;