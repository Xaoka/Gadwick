import { IFeature } from "../../components/subviews/Features/Features";
import { ISession } from "../../components/subviews/TestSession/Overview";

export interface IBoard
{
    id: string;
    name: string;
}

export interface IBoardWithColumns extends IBoard
{
    columns: IBoardColumn[];
}

export interface ICard
{
    id: string;
    name: string;
    link: string;
}

export interface IBoardColumn
{
    id: string;
    name: string;
}

export default interface IThirdPartyAPI
{
    getBoards: () => Promise<IBoard[]>;
    getCards: (boardID: string) => Promise<ICard[]>;
    getColumns: (boardID: string) => Promise<IBoardColumn[]>
    createTicket: (boardID: string, columnID: string, session: ISession, feature: IFeature, reason: { message: string }) => Promise<void>;
    OAuth: () => Promise<void>;
}