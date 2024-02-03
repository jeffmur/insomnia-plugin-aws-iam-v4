"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("./helper");
exports.templateTags = [
    {
        name: 'awsiam',
        displayName: 'awsiam',
        description: 'Insomnia plugin - AWS IAM credential loader',
        args: [{
                displayName: 'Attribute',
                type: 'enum',
                options: [
                    {
                        displayName: helper_1.Attribute.accessKeyId,
                        value: helper_1.Attribute.accessKeyId,
                    },
                    {
                        displayName: helper_1.Attribute.secretAccessKey,
                        value: helper_1.Attribute.secretAccessKey,
                    },
                    {
                        displayName: helper_1.Attribute.sessionToken,
                        value: helper_1.Attribute.sessionToken,
                    },
                ]
            }, {
                displayName: 'Profile',
                description: 'Profile name',
                type: 'string',
                defaultValue: 'default'
            }, {
                displayName: 'Region',
                description: 'Region name',
                type: 'string',
                defaultValue: 'us-west-2'
            }],
        async run(context, attribute, profile, region) {
            const loadedCredentialObject = await helper_1.loadCachedCredentialsFromProfile(profile, region);
            return loadedCredentialObject[attribute];
        },
    }
];
