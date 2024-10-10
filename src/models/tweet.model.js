import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const tweetSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true })

mongoose.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Tweet", tweetSchema)