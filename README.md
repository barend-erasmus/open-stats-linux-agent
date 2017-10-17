# Open Stats Linux Agent

## Installation

Install via npm

`npm install -g open-stats-linux-agent`

Install as systemd service

`sudo open-stats-linux-agent-install --token 6073fec2-03d1-4f51-850f-c656417bc6f0`

`systemctl enable open-stats-linux-agent.service`

Start systemd service

`systemctl start open-stats-linux-agent.service`

## CPU Usage

* Metric Name: `Machine.${hostname}.CPU`
* Metric Type: `timing`
* Metric Value: `10.3213`

## Memory Usage

* Metric Name: `Machine.${hostname}.Memory`
* Metric Type: `timing`
* Metric Value: `48.2834`

## Disk Usage

* Metric Name: `Machine.${hostname}.Disk.${mount}`
* Metric Type: `timing`

## Available Metrics

* Machine.${hostname}.CPU.mean
* Machine.${hostname}.CPU.median
* Machine.${hostname}.CPU.minimum
* Machine.${hostname}.CPU.maximum
* Machine.${hostname}.CPU.standardDeviation

* Machine.${hostname}.Memory.mean
* Machine.${hostname}.Memory.median
* Machine.${hostname}.Memory.minimum
* Machine.${hostname}.Memory.maximum
* Machine.${hostname}.Memory.standardDeviation

* Machine.${hostname}.Disk.${mount}.mean
* Machine.${hostname}.Disk.${mount}.median
* Machine.${hostname}.Disk.${mount}.minimum
* Machine.${hostname}.Disk.${mount}.maximum
* Machine.${hostname}.Disk.${mount}.standardDeviation
