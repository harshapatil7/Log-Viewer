"use client";  

import React, { useState, useEffect } from "react";
import io from 'socket.io-client';

// Connecting to the server
const socket = io('http://localhost:4000');

const LogViewer = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // For initial logs
    socket.on("initial-logs", (initialLogs) => {
      console.log("Initial logs received:", initialLogs); // Debug log
      setLogs(initialLogs);
    });

    // For new log updates
    socket.on('new-log', (newLog) => {
      console.log("New log received:", newLog); // Debug log
      setLogs((prevLogs) => [...prevLogs, newLog]);
    });

    // Clean up event listeners
    return () => {
      socket.off('initial-logs');
      socket.off('new-log');
    };
  }, []);

  return (
    <div>
      <h1>LOGS</h1>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
};

export default LogViewer;
