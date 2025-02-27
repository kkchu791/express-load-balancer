const { HEALTH_STATUS } = require('./constants/health_status');

class Registry {
    constructor() {
        // first hardcoding the servers
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

    getAllActiveServerUrls() {
        // returns an array of all service urls
        return Object.values(this.registry).map((serverData) => {
            return `http://${serverData['ip_address']}:${serverData['port']}`;
        });
    }
}

module.exports = Registry;