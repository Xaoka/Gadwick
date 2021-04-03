const fs = require("fs");
const path = require('path')


function getFiles(rootPath, prefix="")
{
    const fileNames = fs.readdirSync(rootPath);
    let filesToReturn = [];
    for (const fileName of fileNames)
    {
        const pathString = path.join(rootPath, fileName);
        const fileOrDir = fs.statSync(pathString);
        if (fileOrDir.isFile()) {
            if (fileName.endsWith('.feature')) {
                console.log(`${prefix}${fileName}`);
                filesToReturn.push(pathString);
            }
        }
        else if (fileOrDir.isDirectory())
        {
            console.log(`${prefix}${fileName}/`)
            filesToReturn.push(...getFiles(pathString, `  ${prefix}`));
        }
    };
    return filesToReturn;
}
const filePaths = getFiles(".");

function extractPickle(fileName, fileContent)
{
    let pickle =
    {
        description: [],
        scenario: ""
    }
    // Cleanup
    const allLines = fileContent.split("\n");
    const linesWithoutComments = allLines.filter((l) => !l.match(/[ \t]?#/));
    const linesWithoutBlanks = linesWithoutComments.filter((l) => l.trim().length > 0);
    console.log(`${allLines.length} lines, ${linesWithoutComments.length} non-comment lines, ${linesWithoutBlanks.length} behaviour lines`)

    // Validation
    if (!linesWithoutBlanks[0].match(/Feature: [a-zA-Z0-9]+/))
    {
        console.error(`"${fileName}" is not a valid gherkin file - no feature found.`);
    }
    let index = 1;
    for (let i = index; i < linesWithoutBlanks.length; i++)
    {
        const line = linesWithoutBlanks[i].replace(/[ \t]?/, "");
        if (line.match(/[ \t]?Scenario: .+/))
        {
            console.log(`Found scenario`);
            pickle.scenario = line.replace(/Scenario: /, "");
            break;
        }
        else
        {
            console.log(`Description: ${line}`);
            pickle.description.push(line);
        }
    }
    console.log(`"${fileName}" is a valid file.`)
    return pickle;
}

let pickles = [];
for (const path of filePaths)
{
    const fileContent = fs.readFileSync(path, 'utf8');
    // console.dir(fileContent);
    // console.log(`${path} has ${fileContent.split("\n").length} lines`)
    pickles.push(extractPickle(path, fileContent));
}
console.dir(pickles);