import FirstTest from './FirstTest';
import Setup from './Setup';
import DevTools from './DevTools';
import BasicWebTest from './BasicWebTest';
import PostmanBasics from './PostmanBasics';
import CIBasics from './CIBasics';
import BasicAPITest from './BasicAPITest';
import { MediaType } from '../../InfoCard';
import { SubscriptionTier } from '../Subscription/Subscription';

export interface ITutorial
{
    title: string;
    summary: string;
    mediaType?: MediaType;
    subscription?: SubscriptionTier;
    link?:
    {
        url: string;
        component: React.FC;
    }
    externalLink?: string;
}

const tutorialData: { [difficulty: string]: ITutorial[]} =
{
    "basic":
    [
        {
            title: "Your first test",
            summary: "Get started and learn how to write your first test",
            link:
            {
                url: "first-test",
                component: FirstTest
            }
        },
        {
            title: "Intro to Gadwick NPM",
            summary: "Learn how to integrate your test suites with Gadwick",
            link:
            {
                url: "gadwick-setup",
                component: Setup
            }
        },
        {
            title: "Intro to Cypress",
            summary: "Get to grips with the basics of testing a website",
            mediaType: MediaType.Cypress,
            link:
            {
                url: "basic-web-test",
                component: BasicWebTest
            }
        },
        {
            title: "Browser dev tools",
            summary: "Developer tools can help you work out what's really going wrong with a website",
            link:
            {
                url: "dev-tools",
                component: DevTools
            }
        },
        {
            title: "Intro to Postman",
            summary: "Learn the basics of manual testing an API",
            mediaType: MediaType.Postman,
            link:
            {
                url: "postman-basics",
                component: PostmanBasics
            }
        },
        {
            title: "API Testing",
            summary: "Learn the basics of automated API testing",
            mediaType: MediaType.Code,
            link:
            {
                url: "api-tests",
                component: BasicAPITest
            }
        }
    ],
    foundational:
    [
        {
            title: "Writing robust tests",
            summary: "Learn how to write tests that don't break every time you change something"
        },
        {
            title: "XPath & CSS Selectors",
            summary: "Learn how to efficiently grab DOM elements in your tests"
        }
    ],
    advanced:
    [
        {
            title: "Continuous Integration",
            summary: "Learn about the methodology of CI and how to get started.",
            mediaType: MediaType.Code,
            link:
            {
                url: "continuous-integration",
                component: CIBasics
            }
        },
        {
            title: "Intro to BrowserStack",
            summary: "Level up your device testing by harnessing BrowserStack"
        },
        {
            title: "MITM Attacks",
            summary: "Learn about man in the middle attacks and how they can be used in testing."
        },
        {
            title: "SQL Injection",
            summary: "Discover how your databases might be vulnerable to SQL injection.",
            subscription: SubscriptionTier.Premium
        }
    ], 
    external:
    [
        {
            title: "Automation University",
            summary: "Visit the test automation university and take courses on automation.",
            mediaType: MediaType.TAU,
            externalLink: "https://testautomationu.applitools.com/"
        },
        {
            title: "Security testing with BurpSuite",
            summary: "Learn how to use BurpSuite",
            externalLink: "https://portswigger.net/support/using-burp-to-test-for-the-owasp-top-ten"
        },
        {
            title: "Ministry of Testing",
            summary: "Join thousands of other testers in a huge community",
            externalLink: "https://www.ministryoftesting.com/dojo/catalog"
        }
    ]
}
export default tutorialData;