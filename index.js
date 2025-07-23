const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const port = process.env.PORT || 3000;
const nodemailer = require("nodemailer");
const upload = multer({ dest: "uploads/" });
require("dotenv").config();

app.listen(port);
app.use(express.json());

app.use(cors({ origin: ["https://cfl-ten.vercel.app"] }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // or specific origin
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "n81058538@gmail.com",
    pass: `${process.env.MAIL_PASSWORD}`,
  },
});

app.post("/enquiry", (req, res) => {
  const mailOptions = {
    from: "n81058538@gmail.com",
    to: "miticnemanja223@gmail.com",
    subject: `${req.body.nameSurname}`,
    text: `${req.body.message}\n\n${req.body.email}\n${req.body.phone}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error("Error:", error);
    }
  });
});

app.post("/estimate", upload.single("file"), async (req, res) => {
  const jsonData = JSON.parse(req.body.data);
  const file = req.file;
  const mailOptions = {
    from: "n81058538@gmail.com",
    to: "miticnemanja223@gmail.com",
    subject: `New Estimate Received`,
    text: `Name: ${jsonData.clientsInfo.name}, Surname: ${jsonData.clientsInfo.surname}\n
Company: ${jsonData.clientsInfo.company}\n
Street address: ${jsonData.clientsInfo.streetAddress}, City: ${jsonData.clientsInfo.city}, State: ${jsonData.clientsInfo.state}, ZIP Code: ${
      jsonData.clientsInfo.zip
    }\n
Apt, Room, Office: ${jsonData.clientsInfo.apt}\n
Phone number: ${jsonData.clientsInfo.phone}, Email: ${jsonData.clientsInfo.email}, Fax: ${jsonData.clientsInfo.fax}\n
           
Client need transport: ${jsonData.transportRequired == "true" ? "Yes" : "No"}\n
${
  jsonData.transportRequired == "true"
    ? `${`Pick-up Location
    Street address: ${jsonData.transport.pickup.streetAddress}
    City: ${jsonData.transport.pickup.city}
    Street address 2: ${jsonData.transport.pickup.streetAddress2}
    State: ${jsonData.transport.pickup.state}
    ZIP Code: ${jsonData.transport.pickup.zip}
    This is: ${jsonData.transport.pickup.thisis}
    Type of building: ${jsonData.transport.pickup.typeofbuilding}
    Loading dock: ${jsonData.transport.pickup.loadingdock}
    Parking on side: ${jsonData.transport.pickup.parkingonside}\n
Delivery Location
    Street address: ${jsonData.transport.delivery.streetAddress}
    City: ${jsonData.transport.delivery.city}
    Street address 2: ${jsonData.transport.delivery.streetAddress2}
    State: ${jsonData.transport.delivery.state}
    ZIP Code: ${jsonData.transport.delivery.zip}
    This is: ${jsonData.transport.delivery.thisis}
    Type of building: ${jsonData.transport.delivery.typeofbuilding}\n
${
  jsonData.transport.extraStopRequired == "true"
    ? `Extra stop
    Street address: ${jsonData.transport.extrastop.streetAddress}
    City: ${jsonData.transport.extrastop.city}
    Street address 2: ${jsonData.transport.extrastop.streetAddress2}
    State: ${jsonData.transport.extrastop.state}
    ZIP Code: ${jsonData.transport.extrastop.zip}
    This is: ${jsonData.transport.extrastop.thisis}
    Type of building: ${jsonData.transport.extrastop.typeofbuilding}\n`
    : ""
}
Items available for pick-up: ${jsonData.transport.datepickup}
Delivery deadline: ${jsonData.transport.datedelivery == "" ? "/" : jsonData.transport.datedelivery}
${
  jsonData.transport.specificoperatehours == "true"
    ? `Operating hours
      ${jsonData.transport.operatinghours.start} till ${jsonData.transport.operatinghours.end}`
    : ""
}
${jsonData.transport.transitInsurance == "true" ? "\nClient require transit insurance" : ""}
${jsonData.transport.transitInsurance == "true" ? `Declared value for transit: ${jsonData.transport.declaredTransitValue}$` : ""}

${jsonData.services.length > 0 ? `Requested services: ${jsonData.services.join(", ")}` : ""}

${jsonData.storageInsurance == "true" ? "Client require storage insurance" : ""}
${jsonData.storageInsurance == "true" ? `Declared value for storage: ${jsonData.declaredStorageValue}$` : ""}

${jsonData.inventory.length > 0 ? "Inventory" : ""}

${
  jsonData.inventory.length > 0
    ? `${jsonData.inventory.map((item) => {
        return `Type: ${item.type}, Medium: ${item.medium}, Quantity: ${item.quantity}
Width: ${item.dimensions.width}, Height: ${item.dimensions.height}, Length: ${item.dimensions.length}, Weight: ${item.dimensions.weight}
Description: ${item.description}\n\n`;
      })}`
    : ""
}
    `}`
    : ""
}`,
    attachments: file
      ? [
          {
            filename: file.originalname,
            path: file.path,
          },
        ]
      : [],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Email failed to send" });
  }
});

app.get("/test", (req, res) => {
  res.send("Received successfully!");
});
