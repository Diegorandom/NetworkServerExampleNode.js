process.stdout.write('\u001B[2J\u001B[0;0f');

const server = require('net').createServer();
let counter = 0;
let sockets = {};

timestamp = () => {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes()}`;
};

server.on('connection', (socket) => {
  socket.id = counter++;
  console.log('Client connected');
  socket.write('Please type your name \n');

  socket.on('data', (data) => {
    if (!sockets[socket.id]) {
      socket.name = data.toString().trim();
      socket.write(`Welcome ${socket.name}!  \n`);
      sockets[socket.id] = socket;
      return;
    }
    Object.entries(sockets).forEach(([key, cs]) => {
      if (socket.id == key) return;
      cs.write(`${socket.name} ${timestamp()}: `);
      cs.write(data);
    });
  });

  //socket.setEncoding('utf8');

  socket.on('end', () => {
    delete sockets[socket.id];
    console.log('Client disconnected');
  });
});

server.listen(8000, () => console.log('Server bound'));
