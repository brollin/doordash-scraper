// run the script with npx ts-node main.ts
console.log("running...");

const fs = require("fs");
const path = require("path");

// read every file in the data directory
const dataDir = path.join(__dirname, "data");
const files = fs.readdirSync(dataDir);

const orderData = [];

// read the content of each file
files.map((file) => {
  const filePath = path.join(dataDir, file);

  // load the content of the file as json
  const json = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const data = getOrderData(json);
  orderData.push(data);
});

console.log("results");
console.log(orderData);

function getOrderData(data) {
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
    storeName: data.props.pageProps.pageProps.receiptData.storeName,
    personTotals: getPersonTotals(data),
    totalCharged:
      data.props.pageProps.pageProps.consumerOrders.totalCharged / 100,
  };
}

function getPersonTotals(data) {
  const personTotals = {};

  const { receiptData } = data.props.pageProps.pageProps;
  const totalCharged =
    data.props.pageProps.pageProps.consumerOrders.totalCharged / 100;
  const subtotal = data.props.pageProps.pageProps.consumerOrders.subtotal / 100;

  receiptData.orders.forEach((order) => {
    const creatorName =
      order.creator.localizedNames.formalName ||
      order.creator.localizedNames.informalName;

    const personTotalWithoutFees = order.orderItemsList.reduce(
      (acc, item) => acc + (item.quantity * item.item.price) / 100,
      0,
    );
    const personTotal = (personTotalWithoutFees / subtotal) * totalCharged;
    personTotals[creatorName] = personTotal;
  });

  const calculatedTotal = Object.values(personTotals).reduce(
    (acc, val) => acc + val,
    0,
  );
  personTotals["calculatedTotal"] = calculatedTotal;
  // if (Math.abs(calculatedTotal - totalCharged) > 0.01) {
  //   debugger;
  // }

  return personTotals;
}
