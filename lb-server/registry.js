const { HEALTH_STATUS } = require('./constants/health_status');
const { PORT } = require('./constants/port');

class Registry {
    constructor() {
        this.registry = {}
    }

    getAllServers() {
        return this.registry;
    }

    getAllActiveServerUrls() {
        return Object.values(this.registry).map((serverData) => {
            return `http://${serverData['ip_address']}:${serverData['port']}`;
        });
    }

    resetFailureCount(server) {
        this.registry[server]['failure_count'] = 0;
        return true;
    }

    deregisterServer(server) {
        delete this.registry[server];
        return true;
    }

    incrementFailureCount(server) {
        this.registry[server]['failure_count']++;
        return true;
    }

    register(ip_address){
        try {
            this.registry[ip_address] = {
                'ip_address': ip_address,
                'port': PORT.HTTP,
                'last_heartbeat_timestamp:': new Date(),
                'health_status': HEALTH_STATUS.HEALTHY,
                'failure_count': 0,
            };

            return true;
        } catch (e) {
            return false;
        }
    }
}

const instance = new Registry();
module.exports = instance;