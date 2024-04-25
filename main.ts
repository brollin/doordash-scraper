// run the script with npx ts-node main.ts

console.log("running...");

const fs = require("fs");
const path = require("path");

// read every file in the data directory
const dataDir = path.join(__dirname, "data");
const files = fs.readdirSync(dataDir);

const orderData: any[] = [];

// read the content of each file
files.map((file: any) => {
  const filePath = path.join(dataDir, file);

  // load the content of the file as json
  const json = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const data = getOrderData(json);
  orderData.push(data);
});

console.log("results");
console.log(orderData);

function getOrderData(data: any) {
  const timestamp =
    data.props.pageProps.pageProps.consumerOrders.delivery.createdAt;

  const dtFormat = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "America/Los_Angeles",
  });
  const date = dtFormat.format(new Date(timestamp * 1000));

  return {
    orderUuid: data.props.pageProps.pageProps.orderUuid,
    timestamp,
    date,
    personTotals: getPersonTotals(data),
  };
}

function getPersonTotals(data: any) {
  const personTotals = {};

  return personTotals;
}
