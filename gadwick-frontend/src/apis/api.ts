import Axios from 'axios';

export enum API
{
    Features = "features",
    AppFeatures = "features/app",
    PriorityFeatures = "features/priority",
    TestResults = "results",
    VersionRates  = "results/versions",
    Stats = "stats",
    Applications = "applications",
    Users = "users",
    UsersByAuth = "users/auth",
    Sessions = "sessions",
    SessionsByAuth = "sessions/auth"
}
export enum HTTP { CREATE, READ, UPDATE, DELETE }

function getHTTPMethod(httpMethod: HTTP)
{
    switch (httpMethod)
    {
        case HTTP.CREATE:
            return Axios.post;
        case HTTP.READ:
            return Axios.get;
        case HTTP.UPDATE:
            return Axios.put;
        case HTTP.DELETE:
            return Axios.delete;
    }
}

export default async function serverAPI<T extends object>(apiMethod: API, httpMethod: HTTP, dbID?: string, payload?: object): Promise<T>
{
    const response = await getHTTPMethod(httpMethod)(`http://localhost:3003/${apiMethod}/${dbID||""}`, payload);
    return response.data;
}