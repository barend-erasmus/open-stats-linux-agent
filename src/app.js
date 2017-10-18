"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron = require("cron");
const os = require("os");
const si = require("systeminformation");
const yargs = require("yargs");
const metric_1 = require("./services/metric");
const udp_interface_1 = require("./udp-interface");
const argv = yargs.argv;
const hostname = os.hostname();
const endpoint = argv.endpoint || 'open-stats.openservices.co.za';
const endpointHttpPort = argv.endpointHttpPort || '80';
const metricService = new metric_1.MetricService(hostname, argv.token, endpoint, endpointHttpPort, null);
const udpInterface = new udp_interface_1.UDPInterface("0.0.0.0", 8127, metricService);
udpInterface.start();
const job = new cron.CronJob('*/10 * * * * *', () => {
    si.currentLoad((data) => {
        const value = data.currentload;
        metricService.saveData(`CPU`, value);
        console.log(`CPU: ${value}`);
    });
    si.mem((data) => {
        const value = data.used / data.total * 100;
        metricService.saveData(`Memory`, value);
        console.log(`Memory: ${value}`);
    });
    si.fsSize((data) => {
        for (const disk of data) {
            const value = disk.use;
            metricService.saveData(`Disk.${disk.mount.replace(/:/g, '')}`, value);
            console.log(`Disk.${disk.mount.replace(/:/g, '')}: ${value}`);
        }
    });
}, null, true);
const jobAggregate = new cron.CronJob('*/10 * * * * *', () => __awaiter(this, void 0, void 0, function* () {
    yield metricService.sendAggerate(60);
}), null, true);
job.start();
jobAggregate.start();
//# sourceMappingURL=app.js.map