import HELPERS from "../../utils/helpers";

const Reaction = (Mongoose: any) => {
  return new Mongoose.Schema({
    bookID: {
      type: Mongoose.Schema.Types.ObjectId,
      required: [true, "Missing book to react"],
    },
    user: {
      type: Mongoose.Schema.Types.ObjectId,
      required: [true, "Missing to react to book"],
    },
    action: {
      type: String,
      default: "Like",
    },
    period: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "period",
      required: [true, "Period is required"],
    },
    createdAt: {
      type: Date,
      default: HELPERS.currentTime(),
    },
    deletedAt: {
      type: String,
    },
  });
};

export default Reaction;
