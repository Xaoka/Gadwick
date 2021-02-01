import Axios from 'axios';
import { config } from 'react-transition-group';
import { IFeature } from '../../components/subviews/Features/Features';
import { ISession } from '../../components/subviews/TestSession/Overview';
import serverAPI, { API, HTTP } from '../api';
import IThirdPartyAPI, { IBoardColumn } from './IThirdparty';

export interface IAsanaAuthResponse
{
    access_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
    data:
    {
        email: string;
        gid: string;
        id: number;
        name: string;
    }
}

// OAuth: https://developers.asana.com/docs/oauth
async function getConfig()
{
    let accessToken = window.localStorage.getItem("asana_access_token");
    let refreshToken = window.localStorage.getItem("asana_refresh_token");
    const expiryTime = window.localStorage.getItem("asana_expiry");
    if (!accessToken)
    {
        throw Error(`No asana token found`);
    }
    if (!expiryTime)
    {
        window.localStorage.removeItem("asana_access_token");
        throw Error(`No token expiry time, clearing token.`)
    }
    if ((new Date(parseInt(expiryTime))).getTime() <= Date.now())
    {
        const response = await serverAPI<IAsanaAuthResponse & {error?: string, error_description?: string}>(API.Asana, HTTP.CREATE, undefined, { refresh_token: refreshToken, redirect_uri: `${window.location.origin}/auth-redirect` });
        console.dir(response);
        if (response.error)
        {
            throw Error(`Asana Error while refreshing token: ${response.error}, ${response.error_description}`);
            return;
        }

        localStorage.setItem('asana_access_token', response.access_token);
        localStorage.setItem('asana_expiry', `${Date.now() + response.expires_in}`);
        accessToken = response.access_token;
    }
    return {
        headers:
        {
            "Authorization": `Bearer ${accessToken}`
        }
    }
};

const AsanaAPI: IThirdPartyAPI =
{
    getBoards: async () =>
    {
        const config = await getConfig();
        const boards = (await Axios.get(`https://app.asana.com/api/1.0/projects`, config)).data.data;
        return boards.map((board: any) => { return { ...board, id: board.gid }})
    },
    getCards: async (projectGID: string) =>
    {
        const config = await getConfig();
        const cards = (await Axios.get(`https://app.asana.com/api/1.0/tasks?project=${projectGID}`, config)).data.data;
        return cards.map((card: any) => { return { ...card, id: card.gid, link: "TODO: Link" }})
    },
    getColumns: async (projectGID: string) =>
    {
        throw new Error(`Not implemented`);
        return [] as IBoardColumn[];
    },
    createTicket: async (boardID: string, columnID: string, session: ISession, feature: IFeature, reason: { message: string }) =>
    {
        const config = await getConfig();
        const ticketName = `BUG: ${feature.name}`;
        const description = `While testing ${session.app_name} v${session.app_version} this feature failed as:\n${reason.message}`;
        await Axios.post(` https://app.asana.com/api/1.0/tasks`, { ...config, data: { name: ticketName, projects: boardID }})
        throw new Error(`Not implemented`);
    }
}

export default AsanaAPI;