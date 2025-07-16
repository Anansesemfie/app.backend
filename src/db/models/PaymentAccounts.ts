import HELPERS from "../../utils/helpers";

const Account = (Mongoose: any) => {
  return new Mongoose.Schema(
    {
      provider: {
        type: String,
        required: [true, "Provider name required"],
      },
      accountName: {
        type: String,
        required: [true, "Name is required"],
      },
      account: {
        type: String,
        required: [true, "Number is required"],
      },
      branch: {
        type: String,
        required: false,
      },
      createdAt: {
        type: Date,
        default: HELPERS.currentTime(),
      },
      updatedAt: {
        type: Date,
      },
      organization: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Organization",
      }
    },
    {
      timestamp: true,
    }
  );
};

export default Account;
