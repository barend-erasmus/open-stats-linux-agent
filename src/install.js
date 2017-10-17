const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;

fs.writeFileSync('/etc/systemd/system/open-stats-linux-agent.service', `
[Unit]
Description=Open Stats Linux Agent

[Service]
ExecStart=/usr/bin/node ${path.join(__dirname, 'app.js')} --token ${argv.token}

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
`);

// systemctl enable open-stats-linux-agent.service
// systemctl start open-stats-linux-agent.service