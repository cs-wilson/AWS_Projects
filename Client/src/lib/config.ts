function set_env(key: string, value: string) {
    process.env[key] = value;
}

function init_Config() {
    const credentialString = sessionStorage.getItem('credential');
    if (credentialString) {
        const credentials = JSON.parse(credentialString);
        if (credentials) {
            set_env("AWS_ACCESS_KEY_ID", credentials.accessKeyId);
            set_env("AWS_SECRET_ACCESS_KEY", credentials.secretAccessKey);
            set_env("AWS_REGION", credentials.region);
            set_env("AWS_BUCKET", credentials.bucket);
        }
    }
}

export default {
    set_env: init_Config
}