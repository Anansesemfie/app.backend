//Requires
const express = require("express");
const date = new Date();

const { checkSubs, checkOwners } = require("./util/Extras");

const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const {
  checkUser,
  checkAccount,
  requireAuth,
} = require("./middleware/authMiddleware");

const utils = require("./util/utils");

const user = require("./routes/user");
const book = require("./routes/book");
const category = require("./routes/category");
const files = require("./routes/files");
const chapter = require("./routes/chapter");
const reaction = require("./routes/reaction");
const filter = require("./routes/filter");
const subscription = require("./routes/subscribe");
const languages = require("./routes/lang");
const report = require("./routes/report");

const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(cookieParser());

console.log(utils.service);

mongoose.Promise = global.Promise;
//establish connection
mongoose.connect(utils.service.DB, {
  useFindAndModify: false,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
});

//open connection and start server from here
mongoose.connection
  .once("open", () => {
    app.emit("ready");
  })
  .on("error", () => {
    console.log("Couldn't connect to DB");
    app.emit("error");
  });

setInterval(() => {
  app.emit("subscriptions");

  let today = date.getDate();
  let lastDay = utils.daysInMonth();

  if (today == lastDay.days) {
    app.emit("payout");
  }
}, 43200000);

app
  .on("ready", () => {
    app.listen(utils.service.port, () => {
      console.log(`Connection established on port ${utils.service.port} `);
    });
  })
  .on("error", () => {
    console.log("Error whiles connecting to DB");
  });

//events
app.on("subscriptions", async () => {
  try {
    await checkSubs();
  } catch (error) {
    console.log(error);

    let html = `
            <div style="background-color:white; width:100%; height:auto;">
            <img src="${utils.service.host}/images/logo_d.png" style="width:20%;">
            </div><hr>
            <label>Error Message</label>
            <p><h3>Errors</h3></p>
           ${error}
       <div style="background-color:black; color:white; margin-top:5%;">
            copyright Anansesemfie
       </div>
       
       `;

    let mail = {
      receiver: utils.service.mail,
      subject: "Server Error",
      text: "Internal server error",
      html: html,
    };

    utils.mailer(mail);
  }
});

app.on("payout", async () => {
  try {
    const own = await checkOwners();
    if (!own) {
      throw "Something unsual with owner report";
    }
    // console.log(own);
    let partHtml;

    own.forEach((owe) => {
      partHtml += `<br><tr>
            <td style="border: 4px solid white; align-content: center; width:2ch;">${owe.email}</td>
            <td style="border: 4px solid white; align-content: center; width:2ch;">
            Account Name:${owe.account.name}<br>
            Acount Number:${owe.account.number}<br>
            Branch:${owe.account.branch}
            </td>
            <td style="border: 4px solid white; align-content: center; width:2ch;">${owe.bookReport.book_count}</td>
            <td style="border: 4px solid white; align-content: center; width:2ch;">${owe.bookReport.dislikes}</td>
            <td style="border: 4px solid white; align-content: center; width:2ch;">Ghs${owe.bookReport.debit}</td>
            <td style="border: 4px solid white; align-content: center; width:2ch;">${owe.bookReport.played}</td>
            <td style="border: 4px solid white; align-content: center; width:2ch;">Ghs${owe.bookReport.credit}</td>
            <td style="border: 4px solid white; align-content: center; width:2ch;">Ghs${owe.bookReport.total}</td>
            </tr>`;
    });

    let html = `
            <div style="background-color:white; width:100%; height:auto;">
            <img src="${utils.service.host}/images/logo_d.png" style="width:20%;">
            </div><hr>
            <label>Owners</label>
            <p><h3>Payouts</h3></p>
            <table style=" width: 100%;
            border: 1px solid chocolate;">
            <caption>Monthly</caption>
            <tr>
            <td style="border: 4px solid white; align-content: center; width:2ch;">User mail</td>
            <td style="border: 4px solid white; align-content: center; width:2ch;">Bank Details</td>
            <td style="border: 4px solid white; align-content: center; width:2ch;">Books</td>
            <td style="border: 4px solid white; align-content: center; width:2ch;">Dislikes</td>
            <td style="border: 4px solid white; align-content: center; width:2ch;">Debit</td>
            <td style="border: 4px solid white; align-content: center; width:2ch;">Played</td>
            <td style="border: 4px solid white; align-content: center; width:2ch;">Credit</td>
            <td style="border: 4px solid white; align-content: center; width:2ch;">Total Payout</td>
            </tr>
           ${partHtml}
           </table>
       <div style="background-color:black; color:white; margin-top:5%;">
            copyright Anansesemfie
       </div>
       
       `;

    let mail = {
      receiver: utils.service.mail,
      subject: "Payouts",
      text: "Owner List",
      html: html,
    };

    utils.mailer(mail);
  } catch (error) {
    console.log(error);

    let html = `
            <div style="background-color:white; width:100%; height:auto;">
            <img src="${utils.service.host}/images/logo_d.png" style="width:20%;">
            </div><hr>
            <label>Error Message</label>
            <p><h3>Errors</h3></p>
           ${error}
       <div style="background-color:black; color:white; margin-top:5%;">
            copyright Anansesemfie
       </div>
       
       `;

    let mail = {
      receiver: utils.service.mail,
      subject: "Server Error",
      text: "Internal server error",
      html: html,
    };

    utils.mailer(mail);
  }
});

//routes

app.get("*", checkUser);
app.use("/user", checkUser, user);
app.use("/book", book);

app.use("/category", category);
app.use("/file", files);
app.use("/chapter", chapter);
app.use("/filter", filter);

app.use("/react", reaction);
app.use("/subscribe", subscription);
app.use("/langs", languages);
app.use("/report", report);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/congrats", (req, res) => {
  res.render("congrats");
});

app.get("/about_us", (req, res) => {
  res.render("about-us");
});

app.get("/privacy_policy", (req, res) => {
  res.render("privacy");
});

app.get("/terms_of_use", (req, res) => {
  res.render("tandc");
});

app.use("", (req, res) => {
  res.render("notFound");
});
