import mongoose from "mongoose";

const eventSchema = mongoose.Schema({

firstImage: {
 type: String,
 default: null,
},

firstImagePublicId: {
 type: String,
},

secondImage: {
    type: String,
    default: null,
},

secondImagePublicId: {
    type: String,
},

thirdImage: {
    type: String,
    default: null,
},

thirdImagePublicId: {
    type: String,
},

title: {
    type: String,
},

description: {
    type: String,
},

},
{timestamps: true}
);

const eventModel = 

mongoose.models.eventModel || mongoose.model("eventModel", eventSchema);

export default eventModel;