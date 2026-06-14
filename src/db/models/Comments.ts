import HELPERS from "../../utils/helpers";

const Comments = (Mongoose: any) => {
  return new Mongoose.Schema({
    bookID: {
      type: Mongoose.Schema.Types.ObjectId,
      required: [true, "Missing book to comment on"],
    },
    user: {
      type: Mongoose.Schema.Types.ObjectId,
      required: [true, "Missing user to comment on book"],
    },
    comment: {
      type: String,
      required: [true, "Comment is empty"],
      maxlength: [1000, "Comment too long"],
    },
    period: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "period",
      required: [true, "Period is required"],
    },
    parentId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "BookComments",
      required: false,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    deletedAt: {
      type: Date,
    },
  });
};

export default Comments;
