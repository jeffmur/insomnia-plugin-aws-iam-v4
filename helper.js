"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const AWS = require('aws-sdk');
const awscred = require('awscred');
let locallyCachedCreds = {};
let lastCachedTimestamp = Date.now();
async function loadCachedCredentialsFromProfile(profileName, region) {
    const cacheKey = `${profileName}-${region}`;
    if (locallyCachedCreds[cacheKey] && Date.now() < lastCachedTimestamp + 10 * 1000) {
        return locallyCachedCreds[cacheKey];
    }
    locallyCachedCreds[cacheKey] = await loadCredentialsFromProfile(profileName, region);
    lastCachedTimestamp = Date.now();
    return locallyCachedCreds[cacheKey];
}
exports.loadCachedCredentialsFromProfile = loadCachedCredentialsFromProfile;
async function loadCredentialsFromProfile(profileName, region) {
    const loadAwsCred = util_1.promisify(awscred.load);
    let profileCredentials = undefined;
    try {
        profileCredentials = await loadAwsCred({ 'profile': profileName });
    }
    catch (e) { }
    if (profileCredentials && profileCredentials.credentials.accessKeyId) {
        return profileCredentials.credentials;
    }
    // if credential isn't found, check if source_profile is configured for assume_role
    const profileConfig = await util_1.promisify(awscred.loadProfileFromIniFile)({ profile: profileName }, 'config');
    if (!profileConfig || !profileConfig.role_arn || !profileConfig.source_profile) {
        return {};
    }
    const sourceProfileCreds = await util_1.promisify(awscred.loadProfileFromIniFile)({ 'profile': profileConfig.source_profile }, 'credentials');
    return await loadCredentialsFromAssumedRole(profileConfig, sourceProfileCreds, profileName, region);
}
exports.loadCredentialsFromProfile = loadCredentialsFromProfile;
async function loadCredentialsFromAssumedRole(profile, sourceCredentials, sessionName, region) {
    return new Promise((resolve, reject) => {
        const sourceCreds = new AWS.Credentials(sourceCredentials['aws_access_key_id'], sourceCredentials['aws_secret_access_key'], sourceCredentials['aws_session_token']);
        const stsClient = new AWS.STS({
            credentials: sourceCreds,
            region: region
        });
        stsClient.assumeRole({
            RoleArn: profile['role_arn'],
            RoleSessionName: sessionName,
        }, (err, data) => {
            var _a, _b, _c;
            if (err) {
                reject(err);
            }
            resolve({
                [Attribute.accessKeyId]: (_a = data.Credentials) === null || _a === void 0 ? void 0 : _a.AccessKeyId,
                [Attribute.secretAccessKey]: (_b = data.Credentials) === null || _b === void 0 ? void 0 : _b.SecretAccessKey,
                [Attribute.sessionToken]: (_c = data.Credentials) === null || _c === void 0 ? void 0 : _c.SessionToken
            });
        });
    });
}
var Attribute;
(function (Attribute) {
    Attribute["accessKeyId"] = "accessKeyId";
    Attribute["secretAccessKey"] = "secretAccessKey";
    Attribute["sessionToken"] = "sessionToken";
})(Attribute = exports.Attribute || (exports.Attribute = {}));
