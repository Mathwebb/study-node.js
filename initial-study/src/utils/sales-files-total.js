const fs = require('fs').promises;
const path = require("path");

async function findSalesFiles(folderName){
    salesFiles = []

    async function findFiles(folderName){
        const items = await fs.readdir(folderName, { withFileTypes: true });

        for(const item of items){
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

async function calculateSalesTotal(salesFiles) {
    let salesTotal = 0;
    
    for (const salesFile of salesFiles) {
        const data = JSON.parse(await fs.readFile(salesFile));
        salesTotal += data.total;
    }
  
    return salesTotal;
}

module.exports.runSalesTotal = async () => {
    const salesDir = path.join(__dirname, '..', '..', "stores");
    const salesTotalsDir = path.join(__dirname, '..', '..', "salesTotals");

    try{
        await fs.mkdir(salesTotalsDir);
    } catch {
        console.log(`${salesTotalsDir} already exists.`);
    }
    
    const salesFiles = await findSalesFiles(salesDir);
    // console.log(salesFiles);
    const salesTotals = await calculateSalesTotal(salesFiles);

    await fs.writeFile(path.join(salesTotalsDir, "totals.txt"), `${salesTotals}\r\n`, {flag: 'a'});
}
