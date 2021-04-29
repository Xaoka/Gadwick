import TrelloAPI from './trello';
import AsanaAPI from './asana';
import IThirdPartyAPI from './IThirdparty';
import JiraAPI from './jira';

export enum ThirdPartyProviders
{
    Trello = "Trello",
    Asana = "Asana",
    JIRA = "JIRA",
    GitLab = "GitLab",
    CucumberStudio = "Cucumber Studio",
    BulkImport = "Bulk Import",
    None = "None"
}

function Provider(prov: ThirdPartyProviders): IThirdPartyAPI
{
    switch (prov)
    {
        case "Trello":
            return TrelloAPI;
        case "Asana":
            return AsanaAPI;
        case "JIRA":
            return JiraAPI;
        default:
            throw new Error(`Third party provider ${prov} not currently supported.`)
    }
}

export default Provider;