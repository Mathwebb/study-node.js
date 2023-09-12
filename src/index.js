const { fibonacci } = require("./utils/fibonnaci");
const { runSalesTotal } = require("./utils/sales-files-total");

async function main(){
    const result = fibonacci(5);
    console.log(result);
    runSalesTotal();
}

main();
