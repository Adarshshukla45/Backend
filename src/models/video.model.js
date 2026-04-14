import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
// moongooseaggregatePaginate is a plugin that adds pagination capabilities to Mongoose aggregate queries. 
// It allows you to easily paginate the results of 
// an aggregation pipeline, which is useful for handling large datasets ]
// and improving performance when retrieving data from MongoDB. With this plugin, you can specify the page number and the number of items per page, and it will return t
// he corresponding subset of results along with metadata about the total number of pages and items.

// example usage:
// const options = { page: 1, limit: 10 };
// Model.aggregate(pipeline).aggregatePaginate(options) 

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // cloudinary url
      required: true,
    },
    timestamps:{
        type: Number, // in seconds
        required: true,
    },
    title: {
      type: String,
      required: true,   
        trim: true,
    },
    description: {
      type: String,
      required: true,   
    },
    duration: {
      type: Number, // in seconds
      required: true,
    }, 
    views: {
      type: Number,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }, 

  },
  {
    timestamps: true,
  }
);
videoSchema.plugin(mongooseAggregatePaginate);

export const video = mongoose.model("video", videoSchema);
