const Languages = (Mongoose: any) => {
  return new Mongoose.Schema(
    {
      title: {
        type: String,
        required: [true, "Language Title missing"],
        unique: [true, "Language name is required"],
        lowercase: false,
      },
      active: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamp: true,
    }
  );
};

export default Languages;
