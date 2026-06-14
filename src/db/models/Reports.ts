const Reports = (Mongoose: any) => {
  return new Mongoose.Schema({
    commentID: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "BookComments",
      required: [true, "Missing comment to report"],
    },
    reporter: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Missing reporter"],
    },
    reason: {
      type: String,
      required: [true, "Reason is required"],
      maxlength: [500, "Reason too long"],
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
};

export default Reports;
