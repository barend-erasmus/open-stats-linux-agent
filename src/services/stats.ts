export class StatsService {

    public calculateMean(data: number[]): number {
        if (data.length === 0) {
            return 0;
        }

        let total: number = 0;

        for (let i: number = 0; i < data.length; i += 1) {
            total += data[i];
        }
        return total / data.length;
    }

    public calculateMedian(data: number[]): number {
        if (data.length === 0) {
            return 0;
        }

        data = data.sort((a: number, b: number) => {
            return a - b;
        });

        if (data.length % 2 === 0) {
            return (data[data.length / 2 - 1] + data[data.length / 2]) / 2;
        } else {

            return data[(data.length - 1) / 2];
        }
    }

    public calculateMinimum(data: number[]): number {
        if (data.length === 0) {
            return 0;
        }

        data = data.sort((a: number, b: number) => {
            return a - b;
        });

        return data[0];
    }

    public calculateMaximum(data: number[]): number {
        if (data.length === 0) {
            return 0;
        }

        data = data.sort((a: number, b: number) => {
            return a - b;
        });

        return data[data.length - 1];
    }

    public calculateSum(data: number[]): number {
        let total: number = 0;

        for (let i: number = 0; i < data.length; i += 1) {
            total += data[i];
        }

        return total;
    }

    public calculateStandardDeviation(data: number[]): number {
        if (data.length === 0) {
            return 0;
        }

        const mean: number = this.calculateMean(data);

        const a: number[] = data.map((x) => Math.pow(x - mean, 2));

        const newMean: number = this.calculateMean(a);

        return Math.sqrt(newMean);
    }

    public recalculateStandardDeviation(sum: number, n: number, sumSquared: number): number {

        const meanSum: number = sum / n;
        const meanSumSquared: number = sumSquared / n;

        const result: number = meanSumSquared - Math.pow(meanSum, 2);

        return Math.sqrt(result);
    }
}
