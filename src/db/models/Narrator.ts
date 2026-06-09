const Narrator = (Mongoose: any) => {
  return new Mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "Narrator name missing"],
        unique: [true, "Narrator name must be unique"],
        lowercase: false,
      },
      active: {
        type: Boolean,
        default: true,
      },
      bio: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );
};

export default Narrator;
