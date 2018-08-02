const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const profile = require("./profile");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

app.use("/profile", profile);
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", "./views");

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/test", (req, res) => {
  res.render("test");
});

app.post("/thanks", (req, res) => {
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  console.log(req.body);
  const msg = {
    to: "noelmandal@gmail.com",
    subject: "Message from Portfolio!",
    from: req.body.email,
    text: req.body.fullName + ": " + req.body.message
  };
  sgMail
    .send(msg)
    .then(r => res.render("thanks", { index: req.body }))
    .catch(e => console.error(e.response.body.errors))
    
});

app.listen(process.env.PORT || 8080, () => {
  console.log('listening at http://localhost:' + (process.env.PORT || 8080));
});
