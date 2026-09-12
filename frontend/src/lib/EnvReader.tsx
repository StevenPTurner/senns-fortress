function get(variableName: string) {
    return import.meta.env[`VITE_${variableName}`];
}

function isEnabled(variableName: string) {
    return get(variableName) === 'true'
}

function isLocalDataMode() {
    return get('DATA_MODE') === 'LOCAL'
}

 const env = {get, isEnabled, isLocalDataMode};
 export default env;