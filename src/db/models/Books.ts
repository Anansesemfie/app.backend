import { ObjectId } from "bson";
import HELPERS from "../../utils/helpers";
import { BookStatus } from "./utils";
const Books = (Mongoose: any) => {
  return new Mongoose.Schema(
    {
      title: {
        type: String,
        required: [true, "This book needs a title!"],
        maxlength: [50, "This is a very long title"],
      },
      description: {
        type: String,
        required: [true, "Say something to tease your audience"],
        minlength: [10, "Express yourself much more than this"],
        maxlength: [1500, "Do not narrate the whole thing here"],
      },
      status: {
        type: Number,
        required: true,
        default: BookStatus.Active,
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
      },
      cover: {
        type: String,
        default: "/images/user_fire.jpg",
      },
      associates: [{
        type: ObjectId,
        ref:'users'
      }],
      uploader: {
        type: ObjectId,
        required: [true, "Missing uploader"],
      },
      createdAt: {
        type: Date,
        default: HELPERS.currentTime() || Date.now,
      },
      meta: {
        played: {
          type: Number,
          default: 0,
        },
        views: {
          type: Number,
          default: 0,
        },
        comments: {
          type: Number,
          default: 0,
        },
      },
    },
    {
      timestamps: true,
    }
  );
};

export default Books;
