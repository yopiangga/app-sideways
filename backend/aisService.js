const WebSocket = require('ws');

class AISService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.ships = new Map();
        this.socket = null;
        this.reconnectTimeout = 5000;
        // Split Indonesia into 8 smaller sectors to bypass area limits and ensure better coverage
        this.bboxes = [
            [[6.0, 94.0], [-2.5, 106.0]],   // NW 1
            [[6.0, 106.0], [-2.5, 118.0]],  // NW 2
            [[6.0, 118.0], [-2.5, 130.0]],  // NE 1
            [[6.0, 130.0], [-2.5, 142.0]],  // NE 2
            [[-2.5, 94.0], [-11.0, 106.0]], // SW 1
            [[-2.5, 106.0], [-11.0, 118.0]],// SW 2
            [[-2.5, 118.0], [-11.0, 130.0]],// SE 1
            [[-2.5, 130.0], [-11.0, 142.0]] // SE 2
        ];
        this.messageCount = 0;
    }

    start() {
        this.connect();
        
        // Prune old data every 5 minutes
        setInterval(() => this.prune(), 5 * 60 * 1000);
    }

    connect() {
        console.log('Connecting to AISStream...');
        this.socket = new WebSocket("wss://stream.aisstream.io/v0/stream");

        this.socket.on('open', () => {
            console.log('AISStream connection established.');
            const subscriptionMessage = {
                APIKey: this.apiKey,
                BoundingBoxes: this.bboxes
                // FilterMessageTypes removed to receive all types
            };
            this.socket.send(JSON.stringify(subscriptionMessage));
        });

        this.socket.on('message', (data) => {
            try {
                const message = JSON.parse(data);
                this.handleMessage(message);
            } catch (err) {
                console.error('Error parsing AIS message:', err);
            }
        });

        this.socket.on('error', (err) => {
            console.error('AISStream socket error:', err.message);
        });

        this.socket.on('close', () => {
            console.log('AISStream connection closed. Reconnecting...');
            setTimeout(() => this.connect(), this.reconnectTimeout);
        });
    }

    getShipType(typeNum) {
        if (typeNum >= 70 && typeNum <= 79) return 'Cargo';
        if (typeNum >= 80 && typeNum <= 89) return 'Tanker';
        if (typeNum >= 60 && typeNum <= 69) return 'Passenger';
        if (typeNum === 30) return 'Fishing';
        if (typeNum === 31) return 'Towing';
        if (typeNum === 36) return 'Sailing';
        if (typeNum === 37) return 'Pleasure Craft';
        if (typeNum === 52) return 'Tug';
        return `Type ${typeNum}`;
    }

    handleMessage(msg) {
        this.messageCount++;
        if (this.messageCount % 100 === 0) {
            console.log(`Received ${this.messageCount} AIS messages. Current cache size: ${this.ships.size}`);
        }

        const metadata = msg.MetaData;
        if (!metadata || !metadata.MMSI) return;

        const mmsi = metadata.MMSI;
        const existingShip = this.ships.get(mmsi) || {};

        // Extract raw type from any nested message that might contain it
        let rawType = existingShip.rawType;
        if (msg.Message) {
            const body = Object.values(msg.Message)[0];
            if (body && body.Type !== undefined) rawType = body.Type;
            if (body && body.ShipType !== undefined) rawType = body.ShipType;
        }

        // Robust coordinate extraction
        let lat = metadata.latitude || metadata.Latitude;
        let lng = metadata.longitude || metadata.Longitude;

        if (msg.Message) {
            const body = Object.values(msg.Message)[0];
            if (body) {
                lat = lat || body.Latitude || body.Latitude1 || body.lat;
                lng = lng || body.Longitude || body.Longitude1 || body.lon || body.lng;
            }
        }

        const updatedShip = {
            mmsi: mmsi,
            name: metadata.ShipName?.trim() || existingShip.name || 'UNKNOWN',
            lat: lat || existingShip.lat,
            lng: lng || existingShip.lng,
            rawType: rawType,
            type: rawType ? this.getShipType(rawType) : (existingShip.type || 'Unknown'),
            lastUpdate: new Date()
        };

        // Only update if we have valid coordinates
        if (updatedShip.lat !== undefined && updatedShip.lng !== undefined) {
            this.ships.set(mmsi, updatedShip);
        }
    }

    prune() {
        const now = new Date();
        const expiry = 30 * 60 * 1000; // 30 minutes
        let count = 0;

        for (const [mmsi, ship] of this.ships.entries()) {
            if (now - ship.lastUpdate > expiry) {
                this.ships.delete(mmsi);
                count++;
            }
        }
        if (count > 0) {
            console.log(`Pruned ${count} stale AIS targets.`);
        }
    }

    getShips() {
        return Array.from(this.ships.values());
    }
}

module.exports = AISService;
