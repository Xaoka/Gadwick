import serverAPI, { API, HTTP } from "./api";

let user_id: string|null = null;

interface IUser
{
    id: string;
    auth_service: string;
    auth_id: string;
    name: string;
}

export default async function getUserID(auth_id: string)
{
    if (user_id) { return user_id; }
    try
    {
        const internalUser = await serverAPI<IUser[]>(API.UsersByAuth, HTTP.READ, auth_id.replace("auth0|", ""));
        console.dir(internalUser)
        return internalUser[0].id;
    }
    catch (error)
    {
        alert(`User Not Found`);
    }
}