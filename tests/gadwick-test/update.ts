const Axios = require(`axios`);
const fs = require('fs');
const path = require('path')

const testSuiteDirectoryPath = '../cypress/integration';

async function updateStubs()
{
    console.log(`Finding features from Gadwick...`)
    const response = await Axios.get(`http://localhost:3003/features`)
    const features = response.data.data;
    // console.dir(response.data.data);
    // console.log(`Found ${features.length} features:\n${features.map((feature) => feature.feature_name).join("\n")}`)
    fs.readdir(testSuiteDirectoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        const testFiles = []
        files.forEach(function (file) {
            if (fs.statSync(path.join(testSuiteDirectoryPath, file)).isFile()) {
                if (file.endsWith('.spec.js')) {
                    // Do whatever you want to do with the file
                    // console.log(file); 
                    testFiles.push(file.replace('.spec.js', ''));
                }
            }
        });
        for (const gadwickFeature of features)
        {
            if (testFiles.includes(gadwickFeature.feature_name))
            {
                console.log(`[OLD]\t${gadwickFeature.feature_name}`);
            }
            else
            {
                console.log(`[NEW]\t${gadwickFeature.feature_name}`);
                const fileData = `describe('${gadwickFeature.feature_name}', function() {\n\tit('${gadwickFeature.description}')\n})`

                fs.writeFile(path.join(testSuiteDirectoryPath, `${gadwickFeature.feature_name.replace(" ", "")}.spec.js`), fileData, (err) => {
                    if (err) throw err;
                    console.log(`New stub test file created for ${gadwickFeature.feature_name}`);
                });
            }
        }
        const gadwickNames = features.map((f) => f.feature_name);
        for (const localFeature of testFiles)
        {
            if (!gadwickNames.includes(localFeature))
            {
                console.log(`[LOCAL]\t${localFeature}`);
            }
        }
    });
}

updateStubs();