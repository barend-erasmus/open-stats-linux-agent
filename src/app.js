const cron = require('cron');
const os = require('os');
const SDC = require('statsd-client');
const si = require('systeminformation');

const hostname = os.hostname();

const sdc = new SDC({ host: 'open-stats.openservices.co.za', prefix: `Machine.${hostname}` });

const job = new cron.CronJob('*/10 * * * * *', () => {

    // Send CPU Usage
    si.currentLoad((data) => {
        const value = data.currentload;
        sdc.gauge('CPU', value);
        console.log(`CPU: ${value}`);
    });

    // Send Memory Usage
    si.mem((data) => {
        const value = data.used / data.total * 100;
        sdc.gauge('Memory', value);
        console.log(`Memory: ${value}`);
    });

    // Send Disk Usage
    si.fsSize((data) => {
        for (const disk of data) {
            const value = disk.use;
            sdc.gauge(`Disk.${disk.mount}`, value);
            console.log(`Disk.${disk.mount}: ${value}`);
        }
    });
}, null, true);

job.start();


