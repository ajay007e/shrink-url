const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("../client_secret.json");

const doc = new GoogleSpreadsheet(
  "15DpUk2_W7GFfbfi6O1JmDWtVuh-8HFckJNX-BjJMjMg"
);

// async function accessSpreadsheet() {
//   await doc.useServiceAccountAuth({
//     client_email: creds.client_email,
//     private_key: creds.private_key,
//   });
//   await doc.loadInfo(); // loads document properties and worksheets
//   console.log(doc.title);

//   const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
//   console.log(sheet.title);
//   console.log(sheet.rowCount);
// }

module.exports = {
  getInfo: () => {
    return new Promise(async (resolve, reject) => {
      await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
      });
      await doc.loadInfo(); // loads document properties and worksheets
      const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
      //   console.log(doc.title);
      //   console.log(sheet.title);
      //   console.log(sheet.rowCount);
      //   accessSpreadsheet();
      resolve(sheet.title);
    });
  },
  getRow: (info) => {
    return new Promise(async (resolve, reject) => {
      //   console.log();
      await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
      });
      await doc.loadInfo(); // loads document properties and worksheets
      const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
      const rows = await sheet.getRows();
      let flag = true;
      rows.forEach((data) => {
        // console.log(data._rawData);
        if (
          data._rawData[1] === info.alias &&
          data._rawData[3] === info.domain
        ) {
          //   console.log(true, data._rawData[3] + data._rawData[1]);
          flag = false;
        }
      });
      if (flag) {
        resolve({ status: true });
      } else {
        resolve({
          status: false,
          err: "a",
          message: "Alias is not available",
        });
      }
    });
  },
  addRow: (data) => {
    return new Promise(async (resolve, reject) => {
      await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
      });
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];
      const row = await sheet.addRow({
        longUrl: data.url,
        domain: data.domain,
        alias: encodeURI(data.alias),
        time: Number(Date.now()) + 561600000,
      });
      //   console.log(row._rawData);
      if (row) {
        resolve(row._rawData);
      }
    });
  },
  checkRow: () => {
    return new Promise(async (resolve, reject) => {
      await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
      });
      await doc.loadInfo(); // loads document properties and worksheets
      const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
      const rows = await sheet.getRows();
      let now = Date.now();
      let flag = true;
      rows.forEach(async (data, i) => {
        // console.log(data._rawData);
        if (data._rawData[2] <= now) {
          //   console.log(true, data._rawData[3] + data._rawData[1]);
          //   flag = false;
          await rows[i].delete();
        }
      });
      resolve();
    });
  },
  getUrl: (alias) => {
    return new Promise(async (resolve, reject) => {
      await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
      });
      await doc.loadInfo(); // loads document properties and worksheets
      const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
      const rows = await sheet.getRows();
      let url = null;
      let flag = false;
      rows.forEach(async (data, i) => {
        // console.log(data._rawData);
        if (data._rawData[1] === alias) {
          //   console.log(true, data._rawData[3] + data._rawData[1]);
          flag = true;
          url = data._rawData[0];
          // console.log(data._rawData);
        }
      });
      resolve({ status: flag, longUrl: url });
    });
  },
};

// spreadsheet key is the long id in the sheets URL
