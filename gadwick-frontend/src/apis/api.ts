import Axios from 'axios';
import deploymentConfig from '../config.json';

export enum API
{
    Features = "features",
    BulkFeatures = "features/bulk", // TODO: Wrap this into features?
    AppFeatures = "features/app",
    PriorityFeatures = "features/priority",
    TestResults = "results",
    SessionResults = "results/session",
    VersionRates  = "results/versions",
    Stats = "stats/features",
    AppAutomationStats = "stats/automation/app",
    UserAutomationStats = "stats/automation/user",
    Applications = "applications",
    ApplicationsForUser = "applications/user",
    ApplicationsVersions = "applications/versions",
    ApplicationsAPIKey = "applications/key",
    Users = "users",
    UserApps = "users/apps/all",
    UsersByAuth = "users/auth",
    UserAPIKey = "users/key",
    Roles = "roles",
    AppRoles = "roles/apps",
    Invites = "roles/invites",
    Sessions = "sessions",
    SessionsByAuth = "sessions/auth",
    Subscriptions = "products/subscriptions",
    Purchase = "purchases",
    PurchasesForUser = "purchases/user",
    UserSubscription = "purchases/subscription",
    CancelSubscription = "purchases/cancel-subscription/user",
    CheckoutSession = "purchases/create-checkout-session",
    Authentication = "auth",
    Tags = "tags",
    AppTags = "tags/app",
    Asana = "asana",
    Jira = "jira"
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

interface IServerResponse<T>
{
    // data: T;// TODO: Make all apis have this format
    error?: string;
}

export default async function serverAPI<T extends object>(apiMethod: API, httpMethod: HTTP, dbID?: string, payload?: object, additionalPath?: { pathKey: string, value: string }[]): Promise<T>
{
    const server = deploymentConfig.API_URL;
    const pathExtension = additionalPath ? additionalPath.map((p) => `/${p.pathKey}/${p.value}`).join("") : ""
    const response = await getHTTPMethod(httpMethod)<IServerResponse<T>>(`${server}/${apiMethod}/${dbID||""}${pathExtension}`, payload);
    if (response.data.error)
    {
        throw Error(response.data.error);
    }
    return response.data as any;
}