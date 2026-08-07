function get(variableName: string) {
    return import.meta.env[`VITE_${variableName}`];
}

function isEnabled(variableName: string) {
    return get(variableName) === 'true'
}

 const env = {get, isEnabled};
 export default env;