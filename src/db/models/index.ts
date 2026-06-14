import Mongoose from "mongoose";
import { MONGODB_URI, MONGODB_DBNAME } from "../../utils/env";

import Books from "./Books";
import Chapters from "./Chapter";
import Categories from "./Category";
import Languages from "./Languages";
import Authors from "./Author";
import Narrators from "./Narrator";
import Users from "./Users";
import PaymentsAccounts from "./PaymentAccounts";
import Subscribers from "./Subscribers";
import Subscriptions from "./Subscriptions";
import Reactions from "./Reaction";
import Comments from "./Comments";
import Reports from "./Reports";
import BookSeen from "./Seen";
import Origins from "./Origins";
import Externals from "./Externals";
import Sessions from "./Session";
import Period from "./Period";
import organization from "./Organization";
import GenreSchema from "./Genre";
import AppConfigSchema from "./AppConfig";
import QuoteSchema from "./Quote";

import { SessionType, UserType } from "../../dto/index";

Mongoose.connect(MONGODB_URI, {
  autoIndex: true,
  dbName: MONGODB_DBNAME
});

export const Book = Mongoose.model("Books", Books(Mongoose));
export const Chapter = Mongoose.model("chapters", Chapters(Mongoose));
export const Category = Mongoose.model("categories", Categories(Mongoose));
export const Genre = Mongoose.model("genres", GenreSchema(Mongoose));
export const Language = Mongoose.model("languages", Languages(Mongoose));
export const Author = Mongoose.model("authors", Authors(Mongoose));
export const Narrator = Mongoose.model("narrators", Narrators(Mongoose));
export const User = Mongoose.model<UserType>("users", Users(Mongoose));
export const Subscriber = Mongoose.model("subscribers", Subscribers(Mongoose));
export const Reaction = Mongoose.model("BookReacts", Reactions(Mongoose));
export const Comment = Mongoose.model("BookComments", Comments(Mongoose));
export const Report = Mongoose.model("Reports", Reports(Mongoose));
export const Seen = Mongoose.model("BookSeens", BookSeen(Mongoose));
export const Origin = Mongoose.model("origins", Origins(Mongoose));
export const External = Mongoose.model("externals", Externals(Mongoose));
export const Session = Mongoose.model<SessionType>(
  "session",
  Sessions(Mongoose)
);
export const PaymentsAccount = Mongoose.model(
  "paymentsAccount",
  PaymentsAccounts(Mongoose)
);
export const Subscription = Mongoose.model(
  "subscription",
  Subscriptions(Mongoose)
);
export const Periods = Mongoose.model("period", Period(Mongoose));
export const Organization = Mongoose.model(
  "organization",
  organization(Mongoose)
);
export const AppConfig = Mongoose.model(
  "appConfig",
  AppConfigSchema(Mongoose)
);
export const Quote = Mongoose.model("Quote", QuoteSchema(Mongoose));

export default Mongoose;
