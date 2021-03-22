import Axios from 'axios';
import { IFeature } from '../../components/subviews/Features/Features';
import { Stages } from '../../components/subviews/Overview/FeatureImport';
import { ISession } from '../../components/subviews/TestSession/Overview';
import serverAPI, { API, HTTP } from '../api';
import { IAsanaAuthResponse } from './asana';
import IThirdPartyAPI from './IThirdparty';
import openAuthWindow from './AuthWindow';

const JiraAPI: IThirdPartyAPI =
{
    getBoards: async () => [],
    getCards: async () => [],
    getColumns: async () => [],
    createTicket: async () => {},
    OAuth: async () =>
    {
        const code = await openAuthWindow(`https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=zv8XHpxAiXyTAGB46ebm5XhzV9EC6Ksa&scope=read%3Ajira-user&redirect_uri=${encodeURI(`${window.location.origin}/auth-redirect`)}&state=\${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent`);
        const response = await serverAPI<IAsanaAuthResponse>(API.Jira, HTTP.CREATE, undefined, { code: code, redirect_uri: encodeURI(`${window.location.origin}/auth-redirect`) });
        console.log(response);
        localStorage.setItem('jira_access_token', response.access_token);
    }
}

export default JiraAPI;