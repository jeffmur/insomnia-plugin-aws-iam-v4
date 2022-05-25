# Insomnia AWS IAM Plugin

An Insomnia plugin to retrieve aws credentials for use with IAM authentication

Extends previous implementation: https://github.com/dankelleher/insomnia-plugin-aws-iam
To allow for `profiles` and read credentials from file, opposed to copy and pasting from `~/.aws/credentials`

## Usage guide

1. Locate the Insomnia `plugins` directory (on MacOS)
```
cd ~/Library/Application Support/Insomnia/plugins
```
2. Install the plugin in previous step's directory
```
npm i insomnia-plugin-aws-v4-iam
```
3. In Insomnia toggle `Reload Plugins` via Tools -> Reload Plugins
4. For an API call, choose Authentication -> AWS
5. In the Access Key ID, Secret Access Key, Session Token fields, start typing `awsiam`, wait for autocomplete, and choose the appropriate value for each field.


