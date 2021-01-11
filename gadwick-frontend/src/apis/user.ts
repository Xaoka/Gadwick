import serverAPI, { API, HTTP } from "./api";

let user_id: string|null = null;

export interface IUser
{
    id: string;
    auth_service: string;
    auth_id: string;
    name: string;
    email: string;
}

// TODO: Rather than fetching the userID all the time, we should fetch a per-session meta-data bundle about the user & their permissions
// TODO: Use auth0 hooks to generate accounts: https://manage.auth0.com/dashboard/eu/gadwick/hooks
export default async function getUserID(auth_id: string): Promise<string|null>
{
    if (user_id) { return user_id; }
    try
    {
        const internalUser = await serverAPI<IUser[]>(API.UsersByAuth, HTTP.READ, auth_id.replace("auth0|", ""));
        console.dir(internalUser)
        user_id = internalUser[0].id;
        return internalUser[0].id;
    }
    catch (error)
    {
        console.error(error);
        // alert(`User Not Found`);
        return "";
    }
}