import carModel from "../Models/carModel.js";

// Add a new car
export const addCar = async (req, res) => {
  try {
    const { name, engineType, speed, year, price, logo } = req.body;
    let image, publicId;

    if (req.file) {
      image = req.file.path;
      publicId = req.file.filename; // Ensure this is relevant for your model
    }

    const newCar = new carModel({
      name,
      engineType,
      speed,
      year,
      price,
      logo,
      image,
      publicId,
    });

    await newCar.save();
    return res.status(201).json({ msg: "Car Registered", newCar });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

// Get all cars
export const getCars = async (req, res) => {
  try {
    const cars = await carModel.find();
    if (cars.length === 0) {
      return res.status(404).json({ msg: "No cars found" });
    }
    return res.status(200).json(cars);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

// Get a single car by ID
export const getCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await carModel.findById(id);
    if (!car) {
      return res.status(404).json({ msg: "Car not found" });
    }
    return res.status(200).json(car);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

// Update a car
export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, engineType, speed, year, price, logo } = req.body;

    const car = await carModel.findById(id);
    if (!car) {
      return res.status(404).json({ msg: "Car not found" });
    }

    // Check if there's a new image or logo
    if (req.file) {
      car.image = req.file.path;
      // Handle publicId if needed
      car.publicId = req.file.filename; // Ensure to update publicId if needed
    }

    car.name = name;
    car.engineType = engineType;
    car.speed = speed;
    car.year = year;
    car.price = price;
    car.logo = logo; // Ensure you handle this correctly

    await car.save();

    return res.status(200).json({
      msg: "Car updated",
      car: {
        _id: car._id,
        name,
        engineType,
        speed,
        year,
        price,
        logo,
        image: car.image,
        publicId: car.publicId, // Ensure publicId is returned if needed
      },
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

// Delete a car
export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await carModel.findByIdAndDelete(id);
    if (!car) {
      return res.status(404).json({ msg: "Car not found" });
    }
    return res.status(200).json({ msg: "Car deleted" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
