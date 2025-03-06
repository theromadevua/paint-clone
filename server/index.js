import express from 'express'
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import http from 'http'
import path from 'path';
import { Server } from 'socket.io';
import cors from 'cors'

const app = express()

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:5000'],
        methods: ['GET', 'POST']
      }
})

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cors())
app.use(express.json());


app.get('/image', (req, res) => {
    try {
        const file = readFileSync(path.resolve('./files', `${req.query.id}.jpg`))
        const data = `data:image/png;base64,` + file.toString('base64')
        res.json(data)
    } catch (error) {
        console.log(error)
        return res.status(500).json('error')
    }
})

app.post('/image', (req, res) => {
    try {    
        const data = req.body.img.replace(`data:image/png;base64,`, '')
        writeFileSync(path.resolve('./files', `${req.body.id}.jpg`), data, 'base64')
        return res.status(200)
    } catch (error) {
        console.log(error)
        return res.status(500).json('error')
    }
})

const roomData = {};

io.on('connection', socket => {

    socket.emit('id', socket.id)
    
    socket.on('join', (id) => {
        socket.join(id);
        socket.roomId = id
        if (!roomData[id]) {
            roomData[id] = {
                undo: [],
                redo: [],
                users: 1
            };
        }else{
            console.log(roomData[id].users)
            roomData[id].users = roomData[id].users + 1
            console.log(roomData[id].users)
        }
        
        io.to(id).emit('users', roomData[id].users)
    });

    socket.on('pushToUndo', (id, data) => {
        if (roomData[id]) {
           
            roomData[id].undo = [...roomData[id].undo, data];

        } else {
            console.error(`Комната с id ${id} не найдена`);
        }
    });

    socket.on('pushToRedo', (id, data) => {
        if (roomData[id]) {
            console.log(roomData[id].redo.length)
            roomData[id].redo = [data, ...roomData[id].redo];
            console.log(roomData[id].redo.length)
        } else {
            console.error(`Комната с id ${id} не найдена`);
        }
    });

    socket.on('undo', (id) => {
        if(roomData[id].undo.length > 0){
            let dataUrl = roomData[id].undo.pop()
            io.to(id).emit('undo', {dataUrl, socketId: socket.id});
        }
    })

    socket.on('redo', (id) => {
        if(roomData[id].redo.length > 0){
            let dataUrl = roomData[id].redo.shift();
            io.to(id).emit('redo', {dataUrl, socketId: socket.id});
            
        }
    })

    socket.on('draw', (data) => {
        io.to(data.id).emit('draw', data);
    })
    
    socket.on('disconnect', () => {
        if(roomData[socket.roomId]){
            roomData[socket.roomId].users = roomData[socket.roomId].users - 1
            io.to(socket.roomId).emit('users', roomData[socket.roomId].users)
        }
        
        
        for (const roomId in roomData) {
             
            if(io.sockets.adapter.rooms.get(roomId)){
                break
            }else{
                try {
                    unlinkSync(path.resolve('./files', `${roomId}.jpg`), (err) => {
                        if (err) {
                            console.error('Ошибка при удалении файла:', err);
                        } else {
                            console.log('Файл успешно удален.');
                        }
                    });
                    delete roomData[roomId]
                } catch (error) {
                    console.log(error)
                }
                
            }

        }
    });
})


httpServer.listen(5000, () => {console.log('server started')})