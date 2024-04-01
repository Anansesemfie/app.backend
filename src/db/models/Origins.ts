import HELPERS from "../../utils/helpers";

const Origins = (Mongoose: any) => {
  return new Mongoose.Schema({
    name: {
      type: String,
      required: [true, "Origin name is required"],
      unique: [true, "Origin name exist already"],
    },
    flag: {
      type: String,
      unique: [true, "Origin flag should be unique"],
      required: [true, "Origin flag is required"],
    },
    currency: {
      name: String,
      symbol: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    moment: {
      type: Date,
      default: HELPERS.currentTime(),
    },
  });
};

export default Origins;
