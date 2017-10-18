import * as cron from 'cron';
import * as os from 'os';
import * as request from 'request';
import * as si from 'systeminformation';
import * as yargs from 'yargs';

import { MetricService } from './services/metric';
import { UDPInterface } from './udp-interface';

const argv = yargs.argv;

const hostname = os.hostname();
const endpoint = argv.endpoint || 'open-stats.openservices.co.za';
const endpointHttpPort = argv.endpointHttpPort || '80';

const metricService: MetricService = new MetricService(hostname, argv.token, endpoint, endpointHttpPort, (type: string, name: string, value: number) => {
    
});

// UDP Interface
const udpInterface: UDPInterface = new UDPInterface("0.0.0.0", 8127, metricService);
udpInterface.start();

const job = new cron.CronJob('*/10 * * * * *', () => {

    // Send CPU Usage
    si.currentLoad((data) => {
        const value = data.currentload;
        metricService.saveData(`CPU`, value);
        console.log(`CPU: ${value}`);
    });

    // Send Memory Usage
    si.mem((data) => {
        const value = data.used / data.total * 100;
        metricService.saveData(`Memory`, value);
        console.log(`Memory: ${value}`);
    });

    // Send Disk Usage
    si.fsSize((data) => {
        for (const disk of data) {
            const value = disk.use;
            metricService.saveData(`Disk.${disk.mount.replace(/:/g, '')}`, value);
            console.log(`Disk.${disk.mount.replace(/:/g, '')}: ${value}`);
        }
    });
}, null, true);

const jobAggregate = new cron.CronJob('*/10 * * * * *', async () => {

    await metricService.sendAggerate(60);

}, null, true);


job.start();
jobAggregate.start();


