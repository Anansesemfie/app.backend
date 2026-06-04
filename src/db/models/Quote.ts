const Quote = (Mongoose: any) => {
  return new Mongoose.Schema(
    {
      quote: {
        type: String,
        required: [true, "A quote is required"],
      },
      author: {
        type: String,
        default: "Unknown",
      },
      active: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );
};

export default Quote;
