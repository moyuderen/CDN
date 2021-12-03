const { exec } = require("child_process");
const path = require('path');
const appPath = path.join(__dirname);

exec(`${appPath}/deploy.sh`, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
})