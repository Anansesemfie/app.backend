const Author = (Mongoose: any) => {
  return new Mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "Author name missing"],
        unique: [true, "Author name must be unique"],
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

export default Author;
