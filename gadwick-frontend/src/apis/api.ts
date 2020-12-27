import Axios from 'axios';

export enum API
{
    Features = "features",
    AppFeatures = "features/app",
    PriorityFeatures = "features/priority",
    TestResults = "results",
    SessionResults = "results/session",
    VersionRates  = "results/versions",
    Stats = "stats/features",
    AppAutomationStats = "stats/automation/app",
    UserAutomationStats = "stats/automation/user",
    Applications = "applications",
    Users = "users",
    UsersByAuth = "users/auth",
    Roles = "roles",
    AppRoles = "roles/apps",
    Invites = "roles/invites",
    Sessions = "sessions",
    SessionsByAuth = "sessions/auth",
    Subscriptions = "products/subscriptions"
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

export default async function serverAPI<T extends object>(apiMethod: API, httpMethod: HTTP, dbID?: string, payload?: object, additionalPath?: { pathKey: string, value: string }[]): Promise<T>
{
    const pathExtension = additionalPath ? additionalPath.map((p) => `/${p.pathKey}/${p.value}`).join("") : ""
    const response = await getHTTPMethod(httpMethod)(`http://localhost:3003/${apiMethod}/${dbID||""}${pathExtension}`, payload);
    return response.data;
}