import mongoose, {Schema} from 'mongoose';
import toJSON from './plugins/toJSON.plugin.js';

const commentSchema = new Schema(
    {
       project : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Project'
       },
       user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
       },
       message: {
        type : String,
        }
    },
    {
        timestamps : true,
    }
)

commentSchema.plugin(toJSON);
const commentModel = mongoose.model("Comment", commentSchema);
export default commentModel;

