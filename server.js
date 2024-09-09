const { createServer } = require('http');
const { Server } = require('socket.io');
const { createReadStream, appendFile, existsSync, writeFileSync, watchFile, statSync, readFileSync } = require('fs'); // Ensure readFileSync is imported
const path = require('path');

const LOG_FILE_PATH = path.join(process.cwd(), 'logs.txt');
const MAX_LOGS = 11;
const BUFFER_SIZE = 64 * 1024; // 64KB buffer size

// Create log file if not present
if (!existsSync(LOG_FILE_PATH)) {
    writeFileSync(LOG_FILE_PATH, '');
}

// get the last N lines from a large log file
const getLastNLogs = (filePath, n) => {
    return new Promise((resolve, reject) => {
        const lines = [];
        let fileSize = statSync(filePath).size;
        let position = fileSize - BUFFER_SIZE;

        // Ensure the start position is not negative
        if (position < 0) {
            position = 0;
        }

        const stream = createReadStream(filePath, { start: position, end: fileSize });

        stream.on('data', (chunk) => {
            const chunkString = chunk.toString('utf8');
            lines.unshift(...chunkString.split('\n'));
            if (lines.length > n) {
                lines.splice(0, lines.length - n); // Keep only the last N lines
            }
        });

        stream.on('end', () => {
            resolve(lines.filter(line => line.trim() !== '')); // Filter out empty lines
        });

        stream.on('error', reject);
    });
};

// Function to append a new log to the log file
const appendNewLog = () => {
    const newLog = `Log entry at ${new Date().toISOString()}\n`;
    appendFile(LOG_FILE_PATH, newLog, (err) => {
        if (err) {
            console.error('Error appending log:', err);
        } else {
            console.log('Appended new log:', newLog.trim());
        }
    });
};

// Add a new log every 2 seconds
setInterval(appendNewLog, 2000);

// Create an HTTP server and integrate with Socket.IO
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});

// broadcast new logs to all connected clients
const broadcastLog = (log) => {
    console.log('Broadcasting new log:', log); // for Debug Purpose
    io.emit('new-log', log);
};

// Watch for file changes and emit new logs
const watchLogFile = () => {
    watchFile(LOG_FILE_PATH, (curr, prev) => {
        if (curr.mtime > prev.mtime) {  // Check if the file was modified
            try {
                // Read the last log line
                const logs = readFileSync(LOG_FILE_PATH, 'utf8').trim().split('\n');
                const newLog = logs[logs.length - 1]; // Get the last line
                if (newLog) {
                    broadcastLog(newLog);
                }
            } catch (error) {
                console.error('Error reading log file:', error);
            }
        }
    });
};

watchLogFile();

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('New client connected'); // for Debug Purpose

    // Send the last N logs when a client connects
    getLastNLogs(LOG_FILE_PATH, MAX_LOGS).then(logs => {
        socket.emit('initial-logs', logs);
    }).catch(err => {
        socket.emit('error', 'Error reading log file');
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected'); // for Debug Purpose
    });
});

// Start the WebSocket server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
});
