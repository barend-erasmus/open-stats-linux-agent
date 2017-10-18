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
const request = require("request-promise");
const aggregate_1 = require("./../models/aggregate");
const counter_1 = require("./../models/counter");
const gauge_1 = require("./../models/gauge");
const timing_1 = require("./../models/timing");
const stats_1 = require("./stats");
class MetricService {
    constructor(hostname, token, endpoint, endpointHttpPort, onLog) {
        this.hostname = hostname;
        this.token = token;
        this.endpoint = endpoint;
        this.endpointHttpPort = endpointHttpPort;
        this.onLog = onLog;
        this.statsService = new stats_1.StatsService();
        this.counters = {};
        this.gauges = {};
        this.timings = {};
    }
    log(type, name, value, token, tags) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (type) {
                case 'counter':
                    this.updateCounter(name, value, token || 'default');
                    break;
                case 'gauge':
                    this.updateGauge(name, value, token || 'default');
                    break;
                case 'timing':
                    this.updateTiming(name, value, token || 'default');
                    break;
                case 'series':
                    yield this.saveData(name, value);
                    break;
            }
            this.updateCounter('open-stats.metrics', 1, token || 'default');
            if (this.onLog) {
                this.onLog(type, name, value, tags);
            }
        });
    }
    sendAggerate(intervalInSeconds) {
        return __awaiter(this, void 0, void 0, function* () {
            const timestamp = new Date().getTime();
            const aggregate = this.aggerate(intervalInSeconds);
            for (const counter of aggregate.counters) {
                yield this.saveData(counter.name, counter.value);
                yield this.saveData(`${counter.name}.rate`, counter.value / intervalInSeconds);
            }
            for (const gauge of aggregate.gauges) {
                yield this.saveData(gauge.name, gauge.value);
            }
            for (const timing of aggregate.timings) {
                yield this.saveData(`${timing.name}.maximum`, timing.maximum);
                yield this.saveData(`${timing.name}.mean`, timing.mean);
                yield this.saveData(`${timing.name}.median`, timing.median);
                yield this.saveData(`${timing.name}.minimum`, timing.minimum);
                yield this.saveData(`${timing.name}.standardDeviation`, timing.standardDeviation);
            }
        });
    }
    aggerate(intervalInSeconds) {
        const aggregateCounters = [];
        for (const token in this.counters) {
            for (const name in this.counters[token]) {
                aggregateCounters.push(new counter_1.Counter(name, this.counters[token][name], this.counters[token][name] / intervalInSeconds, token));
            }
        }
        this.counters = {};
        const aggregateGauges = [];
        for (const token in this.gauges) {
            for (const name in this.gauges[token]) {
                aggregateGauges.push(new gauge_1.Gauge(name, this.gauges[token][name], token));
            }
        }
        const aggregateTimings = [];
        for (const token in this.timings) {
            for (const name in this.timings[token]) {
                aggregateTimings.push(new timing_1.Timing(name, this.statsService.calculateMean(this.timings[token][name]), this.statsService.calculateMedian(this.timings[token][name]), this.statsService.calculateMinimum(this.timings[token][name]), this.statsService.calculateMaximum(this.timings[token][name]), this.statsService.calculateStandardDeviation(this.timings[token][name]), token));
            }
        }
        this.timings = {};
        return new aggregate_1.Aggregate(aggregateCounters, aggregateGauges, aggregateTimings);
    }
    saveData(name, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield request({
                uri: `http://${this.endpoint}:${this.endpointHttpPort}/api/metrics/log`,
                method: 'POST',
                json: {
                    type: 'series',
                    name: `open-stats-linux-agent.${name}`,
                    value: value,
                    token: this.token,
                    tags: {
                        hostname: this.hostname,
                    }
                }
            });
        });
    }
    updateCounter(name, value, token) {
        if (!this.counters[token]) {
            this.counters[token] = {};
        }
        if (!this.counters[token][name]) {
            this.counters[token][name] = value;
        }
        else {
            this.counters[token][name] += value;
        }
    }
    updateGauge(name, value, token) {
        if (!this.gauges[token]) {
            this.gauges[token] = {};
        }
        if (!this.gauges[token][name]) {
            this.gauges[token][name] = value;
        }
        else {
            this.gauges[token][name] = value;
        }
    }
    updateTiming(name, value, token) {
        if (!this.timings[token]) {
            this.timings[token] = {};
        }
        if (!this.timings[token][name]) {
            this.timings[token][name] = [value];
        }
        else {
            this.timings[token][name].push(value);
        }
    }
}
exports.MetricService = MetricService;
//# sourceMappingURL=metric.js.map