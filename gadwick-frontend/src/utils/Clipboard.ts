export default function copyToClipboard(text: string)
{
    
    navigator.clipboard.writeText(text).then(function() {
        // TODO: Snackbar
    })
    // navigator.permissions.query({name: "clipboard-write"}).then(result => {
    //     if (result.state == "granted" || result.state == "prompt") {
    //         navigator.clipboard.writeText(text).then(function() {
    //             // TODO: Snackbar
    //         })
    //     }
    // });
}