const http = require('http');
const app = require('./app');

const PORT = process.env.PORT;

app.set('port', PORT || 3000);
const server = http.createServer(app);

server.listen(PORT || 3000, () => {
    console.log(`App listening on port ${PORT}`);
});