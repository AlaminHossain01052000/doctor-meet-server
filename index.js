const app = require("express")();
const product = require('./api/product');
const server = require("http").createServer(app);
const cors = require("cors");

const PORT = process.env.PORT || 5000;
app.use("/api/product", product);


const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());



app.get('/', (req, res) => {
    res.send('Running done');
});

io.on("connection", (socket) => {
    socket.emit("me", socket.id);

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded")
    });

    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("callUser", { signal: signalData, from, name });
    });

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal)
    });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));