import {config} from "./getConfig";

function getConfig<T = string>(key: string):T {
    const value = config.get(key);
    return value as T;
}

export default{
    get: getConfig
}

