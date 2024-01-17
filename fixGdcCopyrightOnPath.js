// (C) 2023 GoodData Corporation

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

/**
 * The script serves for GoodData Developers to adress files that they developed a. It will run `yarn gdc-fix-copyright` on all matched files with the allowed extensions below excluding node_modules and dist folders.
 * It accepts relative path to a dir where to run the fix as a command-line argument.
 * It runs the script on every 25 files (batchSize) separately to avoid crashes due to too long command-line arguments.
 */

const allowedExtensions = [".ts", ".js", ".tsx", ".jsx", ".scss"];
const batchSize = 25;

function getFiles(dir) {
    const files = [];

    fs.readdirSync(dir).forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile() && allowedExtensions.includes(path.extname(file))) {
            files.push(filePath);
        } else if (
            stat.isDirectory() &&
            file !== "node_modules" &&
            file !== "dist"
        ) {
            files.push(...getFiles(filePath));
        }
    });

    return files;
}

const relativeDirPath = process.argv[2];

let directories;
if (relativeDirPath) {
    directories = [path.resolve(relativeDirPath)];
} else {
    directories = [process.cwd()];
}

const files = [];

directories.forEach((directory) => {
    const directoryFiles = getFiles(directory);
    files.push(...directoryFiles);
});

console.log(`Total matched files: ${files.length}\n`);

for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);

    console.log("Current batch:");
    batch.forEach((file) => console.log(file));

    const absolutePaths = batch.map((file) => path.resolve(file));
    const filePaths = absolutePaths.join(" ");

    execSync(`yarn gdc-fix-copyright ${filePaths}`, {
        stdio: "inherit",
    });
}
