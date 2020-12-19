import Axios from 'axios';
import { IFeature } from '../../components/subviews/Features/Features';
import { ISession } from '../../components/subviews/TestSession/Overview';
import IThirdPartyAPI, { IBoardColumn } from './IThirdparty';
// OAuth: https://developers.asana.com/docs/oauth
const config = () => { return { headers: { "Authorization": `Bearer ${token}`} } };
let token = `1/1175586585180772:bafe862dc1cb6b48a39a2d3a9434a0e6`;
const AsanaAPI: IThirdPartyAPI =
{
    getBoards: async () =>
    {
        const boards = (await Axios.get(`https://app.asana.com/api/1.0/projects`, config())).data.data;
        return boards.map((board: any) => { return { ...board, id: board.gid }})
    },
    getCards: async (projectGID: string) =>
    {
        const cards = (await Axios.get(`https://app.asana.com/api/1.0/tasks?project=${projectGID}`, config())).data.data;
        return cards.map((card: any) => { return { ...card, id: card.gid, link: "TODO: Link" }})
    },
    getColumns: async (projectGID: string) =>
    {
        throw new Error(`Not implemented`);
        return [] as IBoardColumn[];
    },
    createTicket: async (boardID: string, columnID: string, session: ISession, feature: IFeature, reason: { message: string }) =>
    {
        throw new Error(`Not implemented`);
    }
}

export default AsanaAPI;