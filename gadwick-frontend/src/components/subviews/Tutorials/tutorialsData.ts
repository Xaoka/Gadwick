import FirstTest from './FirstTest';
import Setup from './Setup';

interface ITutorial
{
    title: string;
    summary: string;
    link?:
    {
        url: string;
        component: React.FC;
    }
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
            title: "Setting up Gadwick",
            summary: "Learn how to integrate your test suites with Gadwick",
            link:
            {
                url: "gadwick-setup",
                component: Setup
            }
        },
        {
            title: "Testing a website",
            summary: "Get to grips with the basics of testing a website"
        },
        {
            title: "Browser dev tools",
            summary: "Developer tools can help you work out what's really going wrong with a website"
        }
    ]
}
export default tutorialData;