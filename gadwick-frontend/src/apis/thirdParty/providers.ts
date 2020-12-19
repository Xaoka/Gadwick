import TrelloAPI from './trello';
import AsanaAPI from './asana';
import IThirdPartyAPI from './IThirdparty';

export enum ThirdPartyProviders
{
    Trello = "Trello",
    Asana = "Asana",
    JIRA = "JIRA",
    GitLab = "GitLab",
    CucumberStudio = "Cucumber Studio",
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
        default:
            throw new Error(`Third party provider ${prov} not currently supported.`)
    }
}

export default Provider;