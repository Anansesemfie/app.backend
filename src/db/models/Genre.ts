const Genre = (Mongoose: any) => {
  return new Mongoose.Schema(
    {
      title: {
        type: String,
        required: [true, "Genre Title missing"],
        unique: [true, "Genre name must be unique"],
        lowercase: false,
      },
      active: {
        type: Boolean,
        required: true,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );
};

export default Genre;
