"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateTags = void 0;
// import { fromIni } from "@aws-sdk/credential-providers"; // ES6 import
const { fromIni } = require("@aws-sdk/credential-providers"); // CommonJS import
var hourlyCachedCreds = new Map();
async function loadCredentialsFromProfile(profileName) {
    const credentialsProvider = fromIni({
        /**
         * Optional. The configuration profile to use. If not specified, the provider will use the value
         * in the `AWS_PROFILE` environment variable or a default of `default`.
         */
        profile: profileName,
        /**
         * Optional. The path to the shared credentials file. If not specified, the provider will use
         * the value in the `AWS_SHARED_CREDENTIALS_FILE` environment variable or a default of `~/.aws/credentials`.
         */
        // filepath: "~/.aws/credentials",
        /**
         * Optional. The path to the shared config file. If not specified, the provider will use the
         * value in the `AWS_CONFIG_FILE` environment variable or a default of `~/.aws/config`.
         */
        // configFilepath: "~/.aws/config",
        /**
         * Optional. A function that returns a a promise fulfilled with an MFA token code for the
         * provided MFA Serial code. If a profile requires an MFA code and `mfaCodeProvider` is not a
         * valid function, the credential provider promise will be rejected.
         */
        // mfaCodeProvider: async (mfaSerial) => {
        //   return "token";
        // },
        /**
         * Optional. Custom STS client configurations overriding the default ones.
         */
        // clientConfig: { region },
    });
    return credentialsProvider();
}
var Attribute;
(function (Attribute) {
    Attribute["accessKeyId"] = "accessKeyId";
    Attribute["secretAccessKey"] = "secretAccessKey";
    Attribute["sessionToken"] = "sessionToken";
})(Attribute || (Attribute = {}));
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
                        displayName: Attribute.accessKeyId,
                        value: Attribute.accessKeyId,
                    },
                    {
                        displayName: Attribute.secretAccessKey,
                        value: Attribute.secretAccessKey,
                    },
                    {
                        displayName: Attribute.sessionToken,
                        value: Attribute.sessionToken,
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
        async run(context, attribute, profileName) {
            let currentHour = new Date().getHours();
            // Cache Lasts 1 hour
            const cacheKey = `${profileName}-${currentHour}`.toLowerCase();
            // Create a new cache entry
            if (hourlyCachedCreds.get(cacheKey) === undefined) {
                const creds = await loadCredentialsFromProfile(profileName);
                hourlyCachedCreds.set(cacheKey, creds);
            }
            return hourlyCachedCreds.get(cacheKey)[attribute];
        }
    }
];
