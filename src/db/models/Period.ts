import HELPERS from "../../utils/helpers";

const period = (Mongoose: any) => {
  return new Mongoose.Schema(
    {
      year: {
        type: Number,
        required: [true, "Missing Year"],
      },
      month: {
        type: Number,
        required: [true, "Missing Month"],
      },
      startDate: {
        type: Date,
        required: [true, "Missing Start Date"],
      },
      endDate: {
        type: Date,
        required: [true, "Missing End Date"],
      },
      active: {
        type: Boolean,
        default: true,
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
export default period;
