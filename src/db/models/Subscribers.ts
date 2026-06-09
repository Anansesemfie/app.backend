import HELPERS from "../../utils/helpers";

const Subscribers = (Mongoose: any) => {
  return new Mongoose.Schema(
    {
      //active and inactive subscriptions
      parent: {
        type: Mongoose.Schema.Types.ObjectId,
        required: [true, "missing subscription key"],
      },
      user: {
        type: Mongoose.Schema.Types.ObjectId,
        required: [true, "missing user ID"],
      },
      status: {
        type: String,
        default: "Active",
      },
      active: {
        type: Boolean,
        default: true,
      },
      books: [
        {
          type: Mongoose.Schema.Types.ObjectId,
          ref: "books",
        },
      ],
      ref: {
        type: String,
        required: [true, "Reference ID is required"],
        unique: [true, "Reference ID exist already"],
      },
      createdAt: {
        type: Date,
        default: HELPERS.currentTime(),
      },
      updatedAt: {
        type: Date,
      },
      activatedAt: {
        type: Date,
      },
      deactivatedAt: {
        type: Date,
      },
    },
    {
      timestamp: true,
    }
  );
};

export default Subscribers;
