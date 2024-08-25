const Category = (Mongoose: any) => {
  return new Mongoose.Schema(
    {
      title: {
        type: String,
        required: [true, "Category Title missing"],
        unique: [true, "Category name is required"],
        lowercase: false,
      },
      active: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );
};

export default Category;
