const { HEALTH_STATUS } = require('./constants/health_status');

class Registry {
    constructor() {
        this.registry = {
            'server1': {
                'ip_address': 'server1',
                'port': '4300',
                'last_heartbeat_timestamp:': new Date(),
                'health_status': HEALTH_STATUS.HEALTHY,
                'failure_count': 0,
            },
            'server2': {
                'ip_address': 'server2',
                'port': '4300',
                'last_heartbeat_timestamp:': new Date(),
                'health_status': HEALTH_STATUS.HEALTHY,
                'failure_count': 0,
            },
            'server3': {
                'ip_address': 'server3',
                'port': '4300',
                'last_heartbeat_timestamp:': new Date(),
                'health_status': HEALTH_STATUS.HEALTHY,
                'failure_count': 0,
            },
        }
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
        console.log(server, 'is being removed from the registry');
        delete this.registry[server];
        return true;
    }

    incrementFailureCount(server) {
        console.log(server, 'is incrementing failure count');
        this.registry[server]['failure_count']++;
        return true;
    }
}

const instance = new Registry();
module.exports = instance;