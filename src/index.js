const fs = require('fs').promises;
const path = require("path");

function fibonacci(n){
    let n1 = 0, n2 = 1, sum = 0;

    for(let i = 2; i <= n; i++){
        sum = n1 + n2;
        n1 = n2;
        n2 = sum;
    }

    return n === 0 ? n1 : n2;
}

async function findSalesFiles(folderName){
    salesFiles = []

    async function findFiles(folderName){
        const items = await fs.readdir(folderName, { withFileTypes: true });

        for(item of items){
            itemPath = path.join(folderName, item.name);
            if(item.isDirectory()){
                await findFiles(itemPath);
            } else {
                if (path.extname(item.name) === ".json") {
                    await salesFiles.push(itemPath);
                }
            }
        }
    }
    await findFiles(folderName);
    return salesFiles;
}

async function main(){
    const result = fibonacci(5);
    console.log(result);

    const files = await fs.readdir(__dirname);
    console.log(files);

    const salesDir = path.join(__dirname, '..', 'stores');
    const salesFiles = await findSalesFiles(salesDir);
    console.log(salesFiles);
};

main();
