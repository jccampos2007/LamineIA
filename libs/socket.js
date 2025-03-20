//Asignando el servidor al socket.io
const SocketIO = require('socket.io');
var io = null;


//websockets
function startServerSocket(server) {
    io = SocketIO(server,{
        cors: {
          origin: "*",
          methods: ["GET", "POST"]
        }
    });
    ///////////////////////////////////////////////
    io.on('connection', (socket)=>{
         
    
        socket.on('chat:message', (data) =>{
             
            io.sockets.emit('chat:message', data);
        });
        socket.on('chat:typing', (data)=>{
            socket.broadcast.emit('chat:typing', data);
        })
    });
}

function sendDataSockets(user, msj) {    
    io.sockets.emit('chat:message', {
        message:  msj,
        username: user 
   });
}

module.exports ={ startServerSocket, sendDataSockets}
