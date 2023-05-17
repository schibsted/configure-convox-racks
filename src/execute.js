const { exec } = require('child_process');
const lodash = require('lodash');
const diff = require('variable-diff');

const fetchParams = (rack) => {
    return new Promise((resolve, reject) => {
        exec(`convox rack params -r ${rack.name}`, (err, stdout) => {
            if (err) {
                return reject(err);
            }
            const rackParamsArray = stdout.replace(/  +/g, ' ').split('\n');
            rackParamsArray.pop();
            const rackParams = rackParamsArray.map(element => {
                const parts = element.split(' ');
                return [parts.shift(), parts.join(' ')]
            })
            resolve(lodash.fromPairs(rackParams));
        });
    });
};

const diffParams = (newRackParams, oldRackParams) => {
    const changes = lodash.differenceWith(lodash.toPairs(newRackParams), lodash.toPairs(oldRackParams), lodash.isEqual);
    return lodash.fromPairs(changes);
};

const mask = (value) => {
    let valueToReturn = value;

    if (valueToReturn.includes('"')) {
        valueToReturn = valueToReturn.replaceAll('"', '\\\"');
    }

    if (valueToReturn.includes(' ')) {
        valueToReturn = `"${valueToReturn}"`;
    }

    return valueToReturn;
}

const setRackParams = (rack, changeset) => {
    return new Promise((resolve, reject) => {
        const params = Object.keys(changeset)
            .map(param => `${param}=${mask(changeset[param])}`)
            .join(' ');

        exec(`convox rack params set -r ${rack.name} ${params}`, (err, stdout) => {
            if (err) {
                return reject(err);
            }
            console.log(stdout);
            resolve();
        });
    });
};

const execute = (arg) => (config) => {
    if (arg == 'plan' || arg == 'apply') {
        const promises = config.map(async (rack) => {
            try {
                const currentParams = await fetchParams(rack);
                const changeset = diffParams(rack.config, currentParams);

                if (lodash.isEmpty(changeset)) {
                    console.log(`Rack: ${rack.name} - no changes detected`);
                    return;
                }
                console.log(`Rack: ${rack.name} - changes detected `);

                var result = diff(
                    Object.keys(changeset).map(key => `${key}: ${currentParams[key]}`),
                    Object.keys(changeset).map(key => `${key}: ${changeset[key]}`)
                );
                console.log(result.text);

                if (arg == 'apply') {
                    await setRackParams(rack, changeset);
                }
            } catch (err) {
                console.error(err);
                throw err;
            };
        })

        Promise.allSettled(promises).then((results) => results.forEach((result) => result.status == 'rejected' && process.exit(1)));
    }
};

const doPlan = (config) => execute('plan')(config);
const doApply = (config) => execute('apply')(config);

module.exports = {
    doPlan, doApply
};
