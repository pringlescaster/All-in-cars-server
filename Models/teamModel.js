import mongoose from "mongoose";

const teamSchema = mongoose.Schema({

    Image: {
        type: String,
        default: null,
    },

    publicImage: {
        type: String,
    },

    name: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        required: true,
    }
});

const teamModel = 
mongoose.models.teamModel || mongoose.model("teamModel", teamSchema);

export default teamModel;