### Log Viewer with WebSocket and Large File Handling

This project provides a real-time log viewer using WebSocket, which updates clients with new log entries without requiring a page refresh. It is designed to handle large log files efficiently by retrieving only the last few lines from a potentially massive file.

## Features

  * Real-Time Log Updates: Clients receive new log entries in real-time through WebSocket connections.
  * Efficient Large File Handling: Retrieves the last N lines from a large log file without loading the entire file into memory.
  * Automatic Log Appending: Appends new log entries every 5 seconds for demonstration purposes.

## Prerequisites

  * Node.js (v20.17.0 or later recommended)
  * npm (Node Package Manager)

## Project Structure

  * server.js: Contains the server-side logic for handling WebSocket connections and managing the log file.
  * pages.js: Contains the client-side React component that connects to the WebSocket server and displays log entries.

## Installation

# Clone the Repository
```
git clone <repository-url>
cd <repository-directory>
```

# Make sure you have installed the node.js Before starting

Firstly, install the required npm packages:
```
npm install socket.io socket.io-client
```

Now, run the server in one of the terminal:
```bash
node server.js
```

Then, run the clent in another terminal: 
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Handling Large Log Files Efficiently - OverView

In this project, we deal with log files that can grow very large, potentially reaching sizes of up to 10GB. Handling such large files efficiently is crucial to ensure the performance and reliability of the application. We use a combination of techniques to manage and retrieve the last few lines from these large files without significant performance degradation.

# Efficient File Handling with Buffers

To efficiently handle large log files, we use a buffer-based approach to read only the necessary portions of the file. This method avoids loading the entire file into memory, which would be impractical for very large files.

  * Buffered Reading:
        - Buffer Size: We use a buffer size of 64KB to read chunks of the file. This size strikes a balance between memory usage and performance.
        - Reading Backwards: Instead of reading from the beginning of the file, which could be very slow for large files, we read from the end of the file. By seeking to the end and reading backwards, we can efficiently extract the last few lines without scanning the entire file.

  * Implementation:
        - getLastNLogs Function: This function calculates the size of the file and reads a chunk from the end. It processes the chunk to extract the last N lines. This method ensures that we only handle a small portion of the file at any given time, making it efficient for very large files.

# Error Handling

Robust error handling is crucial to maintain the stability of the application, especially when dealing with file operations. We have implemented comprehensive error handling mechanisms to manage potential issues.

  * Error During File Operations:
        - File Read/Write Errors: Errors during file read or write operations are logged to the console to provide immediate feedback on issues such as file access permissions or disk errors.
    
  * Socket.IO Errors:
        - Socket Errors: Errors related to Socket.IO connections are logged, and appropriate error messages are sent to clients to inform them of issues during real-time communication.

# Efficiency

The use of buffered reading and processing only the necessary portions of the file ensures that the application remains responsive and performs well, even with very large log files. This approach minimizes memory usage and reduces the time required to fetch the last few lines of the log file.


## **For queries, contact:**

**Harsha Patil:** [**harshapatil.hp01@gmail.com**](mailto:harshapatil.hp01@gmail.com)
