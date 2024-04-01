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
      moment: {
        type: Date,
        default: HELPERS.currentTime(),
      },
    },
    {
      timestamp: true,
    }
  );
};

export default Account;
