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
const dgram = require("dgram");
class UDPInterface {
    constructor(host, port, metricService) {
        this.host = host;
        this.port = port;
        this.metricService = metricService;
        this.server = dgram.createSocket("udp4");
        this.server.on("message", (data, remote) => this.onMessage(data, remote));
    }
    start() {
        this.server.bind(this.port, this.host);
    }
    _onMessage(dataBuffer, remote) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.onMessage(dataBuffer, remote);
        });
    }
    onMessage(dataBuffer, remote) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = dataBuffer.toString().split(/\n/g);
            for (const message of messages) {
                const splittedMessage = message.split('|');
                const name = splittedMessage[0].split(':')[0];
                const value = splittedMessage[0].split(':')[1];
                const letter = splittedMessage[1];
                const tags = {};
                const rawTags = splittedMessage[2] ? splittedMessage[2].substring(1).split(',') : [];
                for (const item of rawTags) {
                    tags[item.split(':')[0]] = item.split(':')[1];
                }
                let type = null;
                switch (letter) {
                    case "c":
                        type = "counter";
                        break;
                    case "g":
                        type = "gauge";
                        break;
                    case "ms":
                        type = "timing";
                        break;
                    case "s":
                        type = "series";
                        break;
                }
                yield this.metricService.log(type, name, parseFloat(value), tags['token'], tags);
            }
        });
    }
}
exports.UDPInterface = UDPInterface;
//# sourceMappingURL=udp-interface.js.map