const appConfig = (Mongoose: any) => {
  return new Mongoose.Schema(
    {
      autoPeriodCreation: {
        type: Boolean,
        default: true,
      },
    },
    { timestamps: true }
  );
};

export default appConfig;
