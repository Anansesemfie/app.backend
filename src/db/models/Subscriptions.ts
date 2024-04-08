import HELPERS from "../../utils/helpers";
import { ObjectId } from "bson";

const Subscriptions = (Mongoose: any) => {
  return new Mongoose.Schema(
    {
      name: {
        type: String,
        unique: true,
        required: [true, "Subscription needs a unique name"],
      },
      active: {
        type: Boolean,
        default: false,
      },
      visible: {
        type: Boolean,
        default: false,
      },
      duration: {
        type: Number,
        default: "2592000000",
      },
      users: {
        type: Number,
        min: 1,
        required: false,
        default: 1,
      },
      autorenew: {
        type: Boolean,
        default: false,
      },
      amount: {
        type: Number,
        min: 0,
        required: [true, "Subscription amount is missing"],
      },
      origin: {
        type: ObjectId,
        required: [true, "Subscription origin is missing"],
      },
      accent: {
        type: String,
        default: "chocolate",
      },
      createdAt: {
        type: Date,
        default: HELPERS.currentTime(),
      },
    },
    {
      timestamp: true,
    }
  );
};

export default Subscriptions;
