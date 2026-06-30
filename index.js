// Import the Express library — a framework that makes it easy to build
// web servers and APIs in Node.js without writing raw HTTP handling code
import express from 'express';

// Create an Express application instance
// "app" is the main object you use to define routes, middleware, and start the server
const app = express();

// Set the port the server will listen on
// process.env.PORT reads an environment variable called PORT
// (Kubernetes/Docker often inject this) 
// if PORT is not set, it falls back to 3000 as a default
const port = process.env.PORT || 3000;

// Define a GET route for the root URL "/"
// When someone visits http://yourserver/ this function runs
app.get('/', (req, res) => {
  // req  = the incoming request (data sent TO the server)
  // res  = the response object (what we send BACK to the client)

  // res.json() sends back a JSON response automatically
  // setting the correct Content-Type header for you
  res.json({ 
    message: 'Hello, from my container!!',   // a simple greeting message

    service: 'hello-node',                    // identifies which service responded
                                               // (useful when you have many microservices)

    pod: process.env.POD_NAME || 'unknown',   // reads the POD_NAME environment variable
                                               // Kubernetes can inject this automatically
                                               // so you know WHICH pod/container answered
                                               // useful for debugging load-balanced replicas
                                               // falls back to 'unknown' if not set

    time: new Date().toISOString()            // current server time, formatted as a
                                               // standard ISO 8601 string e.g. "2026-06-24T10:00:00.000Z"
  });
});

// Define a GET route for "/readyz"
// This is a READINESS PROBE endpoint — Kubernetes calls this to check
// if the app is READY to receive traffic (e.g. finished startup, DB connected etc.)
// returns plain text "ready" with HTTP status 200 (success)
app.get('/readyz', (req, res) => res.status(200).send('ready'));

// Define a GET route for "/healthz"
// This is a LIVENESS PROBE endpoint — Kubernetes calls this repeatedly to check
// if the app is still ALIVE and functioning (not crashed/frozen)
// if this stops responding, Kubernetes will restart the container
// returns plain text "OK" with HTTP status 200 (success)
app.get('/healthz', (req, res) => res.status(200).send('OK'));


// Start the server and make it listen for incoming requests on the chosen port
// the callback function runs once the server has successfully started
app.listen(port, () => {
  // log a confirmation message to the console/terminal
  // helpful for confirming the server started correctly when you run the container
  console.log(`Example app listening on port ${port}!`);
});