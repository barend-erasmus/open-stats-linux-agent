"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StatsService {
    calculateMean(data) {
        if (data.length === 0) {
            return 0;
        }
        let total = 0;
        for (let i = 0; i < data.length; i += 1) {
            total += data[i];
        }
        return total / data.length;
    }
    calculateMedian(data) {
        if (data.length === 0) {
            return 0;
        }
        data = data.sort((a, b) => {
            return a - b;
        });
        if (data.length % 2 === 0) {
            return (data[data.length / 2 - 1] + data[data.length / 2]) / 2;
        }
        else {
            return data[(data.length - 1) / 2];
        }
    }
    calculateMinimum(data) {
        if (data.length === 0) {
            return 0;
        }
        data = data.sort((a, b) => {
            return a - b;
        });
        return data[0];
    }
    calculateMaximum(data) {
        if (data.length === 0) {
            return 0;
        }
        data = data.sort((a, b) => {
            return a - b;
        });
        return data[data.length - 1];
    }
    calculateSum(data) {
        let total = 0;
        for (let i = 0; i < data.length; i += 1) {
            total += data[i];
        }
        return total;
    }
    calculateStandardDeviation(data) {
        if (data.length === 0) {
            return 0;
        }
        const mean = this.calculateMean(data);
        const a = data.map((x) => Math.pow(x - mean, 2));
        const newMean = this.calculateMean(a);
        return Math.sqrt(newMean);
    }
    recalculateStandardDeviation(sum, n, sumSquared) {
        const meanSum = sum / n;
        const meanSumSquared = sumSquared / n;
        const result = meanSumSquared - Math.pow(meanSum, 2);
        return Math.sqrt(result);
    }
}
exports.StatsService = StatsService;
//# sourceMappingURL=stats.js.map