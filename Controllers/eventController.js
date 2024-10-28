import eventModel from "../Models/eventModel.js";

export const addEvent = async (req, res) => {
  try {
    const { firstImage, secondImage, thirdImage, title, description } =
      req.body;
    const newEvent = new eventModel({
      firstImage,
      secondImage,
      thirdImage,
      title,
      description,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//Get all events
export const getEvents = async (req, res) => {
    try {
        const events = await eventModel.find();
        if(events.length === 0) {
            return res.status(404).json({ message: "No events found" });
        }

        return res.status(200).json(events);
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};


//Get single event
export const getSingleEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const oneEvent = await eventModel.findById(id);
        if (!oneEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).json(oneEvent);
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

//delete event

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEvent = await eventModel.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}
