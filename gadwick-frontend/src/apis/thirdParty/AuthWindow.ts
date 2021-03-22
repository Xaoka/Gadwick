export default async function openAuthWindow(windowURL: string): Promise<string>
{
    return new Promise<string>((resolve, reject) =>
    {
        const newWindow = window.open(windowURL, "_blank", "height=600,width=600,left=50,top=50");
        if (newWindow)
        {
            window.addEventListener("message", (event: any) =>
            {
                if (event.origin !== "https://gadwick.co.uk" && event.origin !== "https://d92df6qhdnhfk.cloudfront.net" && event.origin !== "http://localhost:3006")
                {
                    console.error(`An unauthorised window attempted to trigger the authentication callback: ${event.origin}`);
                    reject();
                    return;
                }
                else
                {
                    console.dir(event);
                    resolve(event.data.code);
                }
            }, { once: true });
        }
    });
}