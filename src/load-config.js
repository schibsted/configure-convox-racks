const process = require('process');
const lodash = require('lodash');

const requiredOptions = [
    'name',
    'config'
];

module.exports = (configFilePath) => {
    const config = configFilePath ? require(`${process.cwd()}/${configFilePath}`) : {};
    config.map((rack) => {
        requiredOptions.map(option => {
            if (!lodash.get(rack, option)) {
                throw new Error(`${option} is required in config file`);
            }
        });
    });
    return config;
};
