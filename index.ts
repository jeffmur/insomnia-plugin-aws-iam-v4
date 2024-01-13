import {Attribute, loadCachedCredentialsFromProfile} from "./helper";

export const templateTags = [
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
        },{
            displayName: 'Profile',
            description: 'Profile name',
            type: 'string',
            defaultValue: 'default'
        },{
            displayName: 'Region',
            description: 'Region name',
            type: 'string',
            defaultValue: 'us-west-2'
        }],
        async run(context: object, attribute: Attribute, profile: String, region: String) {
            const loadedCredentialObject = await loadCachedCredentialsFromProfile(profile, region);
            return loadedCredentialObject[attribute];
        },
    }
];
