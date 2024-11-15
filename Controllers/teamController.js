import teamModel from "../Models/teamModel.js";


//Add a member
export const addMember = async (req, res) => {
    try {
        const { Image, name, role } = req.body;
        const addMember = new teamModel({
            Image,
            name,
            role
        });

        await addMember.save();
        return res.status(201).json({ msg: "New Member Added", addMember});
    } catch (error) {
        return res.status(500).json({ msg: error.message})
    }
};


//Get all members
export const getAllMembers = async (req, res) => {
    try {
      const allMembers = await teamModel.find();
      if(allMembers.length === 0) {
        return res.status(404).json({ msg: "No member"})
      } 
      
      return res.status(200).json(allMembers);
    } catch (error) {
        return res.status(500).json({ msg: error.message});
    }
};

//Update a member
export const updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { Image, name, role } = req.body;
        const updateMember = await teamModel.findById(id);
        if (!updateMember) {
            return res.status(404).json({ msg: "Member not found" });
        }

        updateMember.Image = Image;
        updateMember.name = name;
        updateMember.role = role;

        await updateMember.save();
        return res.status(200).json({ msg: "Member updated", updateMember });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

//Delete a member

export const deleteMember = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteMember = await teamModel.findByIdAndDelete(id);
        if (!deleteMember) {
            return res.status(404).json({ msg: "Member not found" });
        }

        return res.status(200).json({ msg: "Member deleted" });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}


