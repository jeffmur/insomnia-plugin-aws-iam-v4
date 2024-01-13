import {AWSError} from 'aws-sdk';
import {AssumeRoleResponse} from 'aws-sdk/clients/sts';
import {promisify} from 'util';

const AWS = require('aws-sdk');
const awscred = require('awscred');

let locallyCachedCreds: Dictionary<Dictionary<Attribute>> = {}
let lastCachedTimestamp = Date.now()

export async function loadCachedCredentialsFromProfile(profileName: String, region: String) {
    const cacheKey = `${profileName}-${region}`
    if (locallyCachedCreds[cacheKey] && Date.now() < lastCachedTimestamp + 10 * 1000) {
        return locallyCachedCreds[cacheKey]
    }

    locallyCachedCreds[cacheKey] = await loadCredentialsFromProfile(profileName, region)
    lastCachedTimestamp = Date.now()

    return locallyCachedCreds[cacheKey]
}

export async function loadCredentialsFromProfile(profileName: String, region: String) {
    const loadAwsCred = promisify(awscred.load);

    let profileCredentials = undefined
    try {
        profileCredentials = await loadAwsCred({'profile': profileName});
    } catch (e) {}

    if (profileCredentials && profileCredentials.credentials.accessKeyId) {
        return profileCredentials.credentials
    }

    // if credential isn't found, check if source_profile is configured for assume_role
    const profileConfig = await promisify(awscred.loadProfileFromIniFile)({profile: profileName}, 'config')
    if (!profileConfig || !profileConfig.role_arn || !profileConfig.source_profile) {
        return {}
    }

    const sourceProfileCreds = await promisify(awscred.loadProfileFromIniFile)({'profile': profileConfig.source_profile}, 'credentials')
    return await loadCredentialsFromAssumedRole(profileConfig, sourceProfileCreds, profileName, region)
}

async function loadCredentialsFromAssumedRole(profile: Dictionary<string>, sourceCredentials: Dictionary<string>, sessionName: String, region: String) {
    return new Promise((resolve, reject) => {
        const sourceCreds = new AWS.Credentials(
            sourceCredentials['aws_access_key_id'],
            sourceCredentials['aws_secret_access_key'],
            sourceCredentials['aws_session_token'])

        const stsClient = new AWS.STS({
            credentials: sourceCreds,
            region: region
        })

        stsClient.assumeRole({
            RoleArn: profile['role_arn'],
            RoleSessionName: sessionName,
        }, (err: AWSError, data: AssumeRoleResponse) => {
            if (err) {
                reject(err)
            }

            resolve({
                [Attribute.accessKeyId]: data.Credentials?.AccessKeyId,
                [Attribute.secretAccessKey]: data.Credentials?.SecretAccessKey,
                [Attribute.sessionToken]: data.Credentials?.SessionToken
            })
        })
    })
}

export enum Attribute {
    accessKeyId = 'accessKeyId',
    secretAccessKey = 'secretAccessKey',
    sessionToken = 'sessionToken'
}

interface Dictionary<T1> {
    [key: string]: T1
}