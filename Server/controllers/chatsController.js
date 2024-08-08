import Message from "../database/models/messagesSchema.js";
import User from "../database/models/userSchema.js";

export const getChatsInfo = async (req, res) => {
    try {
        // Step 1: Retrieve the contacts array from the user document
        const user = await User.findById(req.user.userId).select("contacts");
        if (!user || !user.contacts) {
            console.log("User or contacts not found");
            res.status(401).send({
                error: true,
                message: "Server Error",
            });
            return;
        }

        // Step 2: Extract all the userId values from the contacts array
        const contactIds = user.contacts.map((contact) => contact.userId);

        // Step 3: Query the User collection using the $in operator
        const contacts = await User.find({ _id: { $in: contactIds } }, "-contacts -password -createdAt -updatedAt -__v");
        res.send({
            error: false,
            contacts,
        });

    } catch (err) {
        console.error(err, " controller");
        res.status(500).send({
            error: true,
            message: "Server Error",
        });
    }
};

export const getChatMessages = async (req, res) => {
    const {receiverUserName} = req.query
    
    const response = await Message.find({
        $or: [
            { sender: req.user.userName, receiver: receiverUserName },
            { sender: receiverUserName, receiver: req.user.userName }
        ]
    });
    res.send(response)
}