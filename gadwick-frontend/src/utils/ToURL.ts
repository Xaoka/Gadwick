

export function appNameToURL(appName: string)
{
    return appName.toLowerCase().replaceAll(" ", "-");
}