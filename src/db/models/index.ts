import Mongoose from "mongoose";
import { MONGODB_URI } from "../../utils/env.js";

import Books from "./Books.js";
import Chapters from "./Chapter.js";
import Categories from "./Category.js";
import Languages from "./Languages.js";
import Users from "./Users.js";
import PaymentsAccounts from "./PaymentAccounts.js";
import Subscribers from "./Subscribers.js";
import Subscriptions from "./Subscriptions.js";
import Reactions from "./Reaction.js";
import Comments from "./Comments.js";
import BookSeen from "./Seen.js";
import Origins from "./Origins.js";
import Externals from "./Externals.js";
import Sessions from "./Session.js";
import Collections from "./Collection.js";

import { UserType } from "../../dto/userDTO.js";

Mongoose.connect(MONGODB_URI, {
  autoIndex: true,
});

export const BookModel = Mongoose.model("Books", Books(Mongoose));
export const Chapter = Mongoose.model("chapters", Chapters(Mongoose));
export const Category = Mongoose.model("categories", Categories(Mongoose));
export const Language = Mongoose.model("languages", Languages(Mongoose));
export const User = Mongoose.model<UserType>("users", Users(Mongoose));
export const Subscriber = Mongoose.model("subscribeds", Subscribers(Mongoose));
export const Reaction = Mongoose.model("BookReacts", Reactions(Mongoose));
export const Comment = Mongoose.model("BookComments", Comments(Mongoose));
export const Seen = Mongoose.model("BookSeens", BookSeen(Mongoose));
export const Origin = Mongoose.model("origins", Origins(Mongoose));
export const External = Mongoose.model("externals", Externals(Mongoose));
export const Session = Mongoose.model("sessions", Sessions(Mongoose));
export const Collection = Mongoose.model("collections", Collections(Mongoose));
export const PaymentsAccount = Mongoose.model(
  "paymentsAccount",
  PaymentsAccounts(Mongoose)
);
export const Subscription = Mongoose.model(
  "subscription",
  Subscriptions(Mongoose)
);

export default Mongoose;
