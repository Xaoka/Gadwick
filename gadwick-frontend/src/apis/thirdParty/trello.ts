import Axios from 'axios';
import { IFeature } from '../../components/subviews/Features/Features';
import { ISession } from '../../components/subviews/TestSession/Overview';
import IThirdPartyAPI from './IThirdparty';
// Temp key until we have OAuth
// TODO: Once deployed, add webhooks: https://developer.atlassian.com/cloud/trello/guides/rest-api/webhooks/
const trelloAPIKey = `482a04295a7abedf6df55c7538921b0f`
let token = `ce5094cddd4bfd789d18616d7a18977e33f1e7fe59c59525857270347fb6c5f0`;
const TrelloAPI: IThirdPartyAPI =
{
    getBoards: async () => (await Axios.get(`https://api.trello.com/1/members/me/boards?key=${trelloAPIKey}&token=${token}`)).data,
    getCards: async (boardID: string) =>
    {
        const cards = (await Axios.get(`https://api.trello.com/1/boards/${boardID}/cards?key=${trelloAPIKey}&token=${token}`)).data;
        return cards.map((card: any) => { return { ...card, link: card.shortUrl } })
    },
    getColumns: async (boardID: string) =>
    {
        const columns = (await Axios.get(`https://api.trello.com/1/boards/${boardID}/lists?key=${trelloAPIKey}&token=${token}`)).data;
        return columns;
    },
    createTicket: async (boardID: string, columnID: string, session: ISession, feature: IFeature, reason: { message: string }) =>
    {
        const ticketName = `BUG: ${feature.name}`;
        const description = `While testing ${session.app_name} v${session.app_version} this feature failed as:\n${reason.message}`;

        await Axios.post(`https://api.trello.com/1/cards?key=${trelloAPIKey}&token=${token}&name=${ticketName}&idList=${columnID}&desc="${description}"`);
    },
    OAuth: async () => {}
}

export default TrelloAPI;