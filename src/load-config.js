const process = require('process');
const lodash = require('lodash');

const requiredOptions = [
    'name',
    'config'
];

module.exports = (configFilePath) => {
    const config = configFilePath ? require(`${process.cwd()}/${configFilePath}`) : {};
    if (!lodash.isArray(config)) {
        throw new Error(`Config is required in to be an array`);
    }
    config.map((rack) => {
        requiredOptions.map(option => {
            if (!lodash.get(rack, option)) {
                throw new Error(`${option} is required in the object ${JSON.stringify(rack)}`);
            }
        });
    });
    return config;
};
