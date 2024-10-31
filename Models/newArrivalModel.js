import mongoose from "mongoose";

const newArrivalSchema = mongoose.Schema({
    image: {
        type: String,
        default: null
      },
    
      publicId: {
        type: String,
      }, 
    
      logo: {
        type: String,
      
      },
      logoPublicId: {
        type: String,
      },
    
      name: {
        type: String,
        required: true,
      },
    
      engineType: {
        type: String,
      },
    
      speed: {
        type: String,
      },
      year: {
        type: String,
      },
    
      price: {
        type: String,
      },
    },
    { timestamps: true}
    );

    const newArrivalModel = 

    mongoose.models.newArrivalModel || mongoose.model("newArrivalModel", newArrivalSchema);

    export default newArrivalModel;