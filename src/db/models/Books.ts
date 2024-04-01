import { ObjectId } from "bson";
import HELPERS from "../../utils/helpers";

const Books = (Mongoose: any) => {
  return new Mongoose.Schema(
    {
      title: {
        type: String,
        required: [true, "This book needs a title!"],
        lowercase: false,
        maxlength: [50, "This is a very long title"],
      },
      description: {
        type: String,
        required: [true, "Say something to tease your audience"],
        minlength: [10, "Express yourself much more than this"],
        maxlength: [1500, "Do not narrate the whole thing here"],
        lowercase: false,
      },
      status: {
        type: String,
        required: true,
        default: "Active",
      },
      snippet: {
        type: String,
      },
      authors: [
        {
          type: String,
          default: "unknown",
        },
      ],
      category: [
        {
          type: ObjectId,
          ref: "category",
        },
      ],
      languages: [
        {
          type: ObjectId,
          ref: "languages",
        },
      ],
      collections: [
        {
          type: ObjectId,
          ref: "collections",
        },
      ],
      folder: {
        type: String,
        unique: true,
        required: false,
      },
      cover: {
        type: String,
        default: "/images/user_fire.jpg",
        required: false,
        unique: false,
      },
      owner: {
        type: ObjectId,
        required: false,
      },
      uploader: {
        type: ObjectId,
        required: [true, "Missing uploader"],
      },
      moment: {
        type: Date,
        default: HELPERS.currentTime(),
      },
      meta: {
        played: Number,
        views: Number,
        likes: Number,
        dislikes: Number,
        comments: Number,
      },
    },
    {
      timestamp: true,
    }
  );
};

export default Books;
