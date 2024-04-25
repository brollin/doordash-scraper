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

  const { receiptData, orderUuid } = data.props.pageProps.pageProps;
  const totalCharged =
    data.props.pageProps.pageProps.consumerOrders.totalCharged / 100;
  const subtotal = data.props.pageProps.pageProps.consumerOrders.subtotal / 100;

  // manually calculate each person's total from the bill
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

  // when the split bill is funky just skip using it by including the order in this list
  const splitBillBlacklist = ["e18a4e51-cc81-40c3-b482-ba95fe304b99"];

  // OR, if the split bill is available just use that instead
  if (
    receiptData.splitBillLineItems &&
    !splitBillBlacklist.includes(orderUuid)
  ) {
    receiptData.orders.forEach((order, index) => {
      const creatorName =
        order.creator.localizedNames.formalName ||
        order.creator.localizedNames.informalName;
      const splitBillLineItems =
        receiptData.splitBillLineItems[index].lineItems;
      const total =
        splitBillLineItems[splitBillLineItems.length - 1].finalMoney
          .unitAmount / 100;
      personTotals[creatorName] = total;
    });
  }

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
