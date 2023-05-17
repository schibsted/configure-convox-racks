#!/usr/bin/env node

const yargs = require('yargs');
const loadConfig = require('./src/load-config');

const { doPlan, doApply } = require('./src/execute');

const params = yargs
    .command('plan', 'Do plan to see if there are changes', {
        config: {
            alias: 'c',
            description: 'config file',
            type: 'string',
        }
    })
    .command('apply', 'Apply changes', {
        config: {
            alias: 'c',
            description: 'config file',
            type: 'string',
        }
    })
    .parse();

const command = params._.pop() || '';
if (!['plan', 'apply'].includes(command)) {
    throw new Error(`Command ${command} is unrecognized`);
}

const config = loadConfig(params.config);

(async () => {
    try {
        if (command === 'plan') {
            return await doPlan(config);
        }

        if (command === 'apply') {
            return await doApply(config);
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();


