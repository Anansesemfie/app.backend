import HELPERS from "../../utils/helpers";

const organization = (Mongoose: any) => {
  return new Mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "Missing Organization Name"],
        unique: true,
        trim: true,
        lowercase: true,
      },
      description: {
        type: String,
      },
      type:{
        type: String,
        enum: ["school", "company", "other"],
        default: "school",
      },
      logo: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: HELPERS.currentTime(),
      },
      updatedAt: {
        type: Date,
      },
    },
    {
      timestamp: true,
    }
  );
};

export default organization;
