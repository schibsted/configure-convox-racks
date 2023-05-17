# configure-convox-racks

Simple npm package to configure your convox racks parameters.

## Usage

First, you need to install this library as dependency in your project:<br /> `npm install --save-dev @schibsted/configure-convox-racks`

Create config file (name it as you want i.e. `convox-config.js`). Below is an example of the structure that this file should have:

```js
module.exports = [
    {
    name: 'organisation/rack',
    config: {
        Autoscale: 'Yes',
        InstancePolicy: 'some policy',
        OnDemandMinCount: '1',
        InstanceType: 't3.medium',
        BuildMemory: '1024',
        BuildCpu: '256',
        VolumeSize: '70',
        BuildVolumeSize: '100',
        // etc
    }},
    // another rack
];
```

In this example, there is a configuration for single rack. However, you can pass as many racks here as you want, each needs to be an object in the array, that has the structure described above.

Now all you have to do is type in terminal:
- `npx @schibsted/configure-convox-racks plan -c convox-config.js` to see if there are some changes 
- `npx @schibsted/configure-convox-racks apply -c convox-config.js` to apply those changes

That's it :)
