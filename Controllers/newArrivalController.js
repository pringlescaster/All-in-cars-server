import newArrivalModel from "../Models/newArrivalModel.js";

export const addRecent = async (req, res) => {
  try {
    const { name, engineType, speed, year, price, logo, image } = req.body;
    const addRecent = new newArrivalModel({
      name,
      engineType,
      speed,
      year, 
      price, 
      logo,
      image,
    });

    await addRecent.save();
    return res.status(201).json({ msg: "New Car Added", addRecent });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

//Get all new Arrivals
export const getNewArrival = async (req, res) => {
  try {
    const allArrivals = await newArrivalModel.find();
    if (allArrivals.length === 0) {
      return res.status(404).json({ msg: "No New Arrivals found" });
    }

    return res.status(200).json(allArrivals);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

//Get by ID
export const getOneArrival = async (req, res) => {
  try {
    const { id } = req.params;
    const oneArrival = await newArrivalModel.findById(id);
    if (!oneArrival) {
      return res.status(404).json({ msg: "New Arrival not found" });
    }
    return res.status(200).json(oneArrival);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};



// Update a new arrival
export const updateArrival = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, engineType, speed, year, price, logo, image } = req.body;

    const updateArrival = await newArrivalModel.findById(id);
    if (!updateArrival) {
      return res.status(404).json({ msg: "New Arrival not found" });
    }

    updateArrival.name = name;
    updateArrival.engineType = engineType;
    updateArrival.speed = speed;
    updateArrival.year = year;
    updateArrival.price = price;
    updateArrival.logo = logo;
    updateArrival.image = image;

    await updateArrival.save();

    return res.status(200).json({ msg: "New Arrival updated", updateArrival });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};


//Delete a new arrival

export const deleteArrival = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteArrival = await newArrivalModel.findByIdAndDelete(id);

    if (!deleteArrival) {
      return res.status(404).json({ msg: "New Arrival not found" });
    }

    return res.status(200).json({ msg: "New Arrival deleted" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
