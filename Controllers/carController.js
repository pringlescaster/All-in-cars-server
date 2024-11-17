import carModel from "../Models/carModel.js";

// Add a new car
export const addCar = async (req, res) => {
  try {
    const {image, publicId, name, engineType, speed, year, price, logo, categories, description } = req.body;
  

    const newCar = new carModel({ 
      name,
      engineType,
      speed,
      year, 
      price,
      logo,
      image, 
      categories,
      description,
      publicId
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


    car.name = name;
    car.engineType = engineType;
    car.speed = speed;
    car.year = year;
    car.price = price;
    car.logo = logo; // Ensure you handle this correctly
    car.description= description;
    car.categories = categories;
    car.image = image;
    car.publicId = publicId;

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
        categories,
        descriptions
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
