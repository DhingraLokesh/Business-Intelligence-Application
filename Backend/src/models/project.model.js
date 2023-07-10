import mongoose, {Schema} from 'mongoose';
import toJSON from './plugins/toJSON.plugin.js';

const projectSchema = new Schema(
    {
       name : {
        type : String,
        trim : true,
       },
       description : {
        type : String,
       }
    },
    {
        timestamps : true,
    }
)

projectSchema.plugin(toJSON);
const projectModel = mongoose.model("Project", projectSchema);
export default projectModel;
