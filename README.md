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

* Metric Name: `open-stats-linux-agent.CPU`

## Memory Usage

* Metric Name: `open-stats-linux-agent.Memory`

## Disk Usage

* Metric Name: `open-stats-linux-agent.Disk.${mount}`