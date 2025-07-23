const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const nodemailer = require("nodemailer");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
require("dotenv").config();

app.listen(port);
app.use(express.json());

app.use(cors());

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

app.get("/test", (req, res) => {
  res.send("Received successfully!");
});
