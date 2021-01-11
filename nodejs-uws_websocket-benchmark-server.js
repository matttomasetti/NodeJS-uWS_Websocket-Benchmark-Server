const port = 8080;
const uWS = require('uWebSockets.js');

/**
 * This class contains the custom logic for the
 * websocket server.
 */
class Server {

    /**
     * Gets the current unix timestamp of the server
     * @returns {number} the current unix timestamp
     */
    get_timestamp() {
        return Math.floor(Date.now() / 1000);
    }

    /**
     * Creates a JSON string containing the message count and the current timestamp
     * @param c {number} The message count
     * @returns {string} A JSON string containing the message count and the current timestamp
     */
    get_event(c) {
        return JSON.stringify({
            "c": c,
            "ts": this.get_timestamp()
        });
    }

    /**
     * Send a connected client an event JSON string
     * @param ws {WebSocket} The client connection the outgoing message is for
     * @param c {number} The message count
     * @returns void
     */
    notify(ws, c) {
        ws.send(this.get_event(c))
    }

    /**
     * Creates the websocket server object with the necessary event handlers,
     * and starts listening on the given port
     * @returns void
     */
    start() {

        /**
         * Initialize the websocket server object
         * @type {TemplatedApp}
         */
        const app = uWS.App().ws('/*', {

            // Websocket server options
            compression: uWS.SHARED_COMPRESSOR,
            maxPayloadLength: 16 * 1024 * 1024,
            idleTimeout: 10,
            maxBackpressure: 1024,

            /**
             * Event triggered whenever a client connects to the websocket
             * @param ws {WebSocket} The newly connected client
             */
            open: (ws) => {

                // send newly connected client initial timestamp
                this.notify(ws, 0)
            },

            /**
             * Event triggered whenever the server receives an incoming message from a client
             * @param ws {WebSocket} The client the incoming message is from
             * @param message The incoming message
             * @param isBinary {boolean} Whether the message was sent in binary mode
             */
            message: (ws, message, isBinary) => {

                // decode incoming message into an object
                let data = JSON.parse(new Buffer.from(message).toString());

                // notify client with event for message with count "c"
                this.notify(ws, data.c);
            }

            /**
             * Tells the websocket server to start listening for incoming connections
             * on the given port
             */
        }).listen(port, (token) => {
            if (token) {
                console.log('Listening to port ' + port);
            } else {
                console.log('Failed to listen to port ' + port);
            }
        });
    }
}


// Create an instance of the websocket server and start it
let server = new Server();
server.start();
