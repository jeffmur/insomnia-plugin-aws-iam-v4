# Insomnia AWS IAM Plugin

An Insomnia plugin to retrieve aws credentials for use with IAM authentication.

Extends previous implementation: https://github.com/dankelleher/insomnia-plugin-aws-iam
To allow for `profiles` and read credentials from file, opposed to copy and pasting from `~/.aws/credentials`

Now supports `role_arn`, thank you [@SushilShrestha](https://github.com/SushilShrestha), with example config:

`$ cat ~/.aws/config`
```
[profile auth]
region = us-west-2
...

[profile foobar]
role_arn = arn:aws:iam:123456:role/foo-bar
source_profile = auth
```

Authenticate with AWS_PROFILE=auth, and assume role within this plugin 🎉

## Usage guide

1. Locate the Insomnia `plugins` directory (on MacOS)
```
cd ~/Library/Application Support/Insomnia/plugins
```
2. Download and Install the plugin in previous step's directory
```
git clone https://github.com/jeffmur/insomnia-plugin-aws-iam-v4.git
cd insomnia-plugin-aws-iam-v4
npm install
```
3. In Insomnia toggle `Reload Plugins` via Tools -> Reload Plugins
4. For an API call, choose Authentication -> AWS
5. In the Access Key ID, Secret Access Key, Session Token fields, start typing `awsiam`, wait for autocomplete, and choose the appropriate value for each field.
