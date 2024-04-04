const socketListen = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);

        // // Listen for events from clients
        // socket.on('event_name', (data) => {
        //     // Handle the event and broadcast data to clients
        //     io.emit('event_name', data);
        // });

        // // Handle disconnections
        // socket.on('disconnect', () => {
        //     console.log('A user disconnected');
        // });
    });
};

module.exports = socketListen