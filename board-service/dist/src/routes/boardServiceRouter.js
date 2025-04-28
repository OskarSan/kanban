"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kanBanCard_1 = require("../models/kanBanCard");
const KanBanCardContent_1 = require("../models/KanBanCardContent");
const User_1 = require("../models/User");
const validateToken_1 = require("../middleware/validateToken");
const router = (0, express_1.Router)();
// updates the order of the users cards when dragged and dropped
router.post('/api/updateUser', validateToken_1.validateToken, async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.user);
        const newOrder = req.body.newOrder;
        const userId = req.user?.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const user = await User_1.User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        console.log(user.cardIds);
        user.cardIds = newOrder;
        user.save();
        console.log(user.cardIds);
        res.status(200).json({ message: 'Cards updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//adds a new card to the database with empty array as content
router.post('/api/addNewCard', validateToken_1.validateToken, async (req, res) => {
    try {
        const userId = req.user?.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        console.log(req.user);
        const kanBanCard = new kanBanCard_1.KanBanCard(req.body);
        kanBanCard.createdBy = req.user?.username;
        console.log(kanBanCard);
        await kanBanCard.save();
        const user = await User_1.User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        user.cardIds.push(kanBanCard._id);
        await user.save();
        res.status(200).json({ message: 'Card added successfully', kanBanCard });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/api/addNewTask', async (req, res) => {
    try {
        const kanBanCardContent = new KanBanCardContent_1.KanBanCardContent(req.body);
        console.log(kanBanCardContent);
        await kanBanCardContent.save();
        res.status(200).json({ kanBanCardContent });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//updates card content, whatever changes are made to the card
//handles also the addition of a new cardEntry
router.post('/api/updateCard', async (req, res) => {
    try {
        const { _id, title, content, status } = req.body;
        const contentPromises = content.map(async (entry) => {
            if (entry._id) {
                await KanBanCardContent_1.KanBanCardContent.findByIdAndUpdate(entry._id, entry);
                return entry._id;
            }
        });
        const contentIds = await Promise.all(contentPromises);
        const updatedCard = await kanBanCard_1.KanBanCard.findByIdAndUpdate(_id, {
            title: title,
            content: contentIds,
            status: status
        }, { new: true });
        if (!updatedCard) {
            res.status(404).json({ message: 'Card not found' });
        }
        res.status(200).json({ message: 'Card updated successfully', card: updatedCard });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/api/deleteCard', async (req, res) => {
    try {
        const { _id } = req.body;
        const card = await kanBanCard_1.KanBanCard.findByIdAndDelete(_id);
        if (!card) {
            res.status(404).json({ message: 'Card not found' });
        }
        res.status(200).json({ message: 'Card deleted successfully', card });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//gets all cards from the database, used by the admin account
router.get('/api/getCards', validateToken_1.validateToken, async (req, res) => {
    try {
        const cards = await kanBanCard_1.KanBanCard.find().populate('content');
        res.status(200).json(cards);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//stupid ass function which sorts the users cards based on the order of the cardIds array
//could be done in a better way for example by making a board component which is used
//inbetween user and the users cards.
router.get('/api/getUsersCards', validateToken_1.validateToken, async (req, res) => {
    console.log("token validated to getUserCardsS");
    try {
        console.log("user: ", req.user?.user);
        const userId = req.user?.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const user = await User_1.User.findById(userId);
        if (!user) {
            console.log("user not found");
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if (user.isAdmin == true) {
            const cards = await kanBanCard_1.KanBanCard.find().populate('content');
            res.status(200).json(cards);
            return;
        }
        const cards = await kanBanCard_1.KanBanCard.find({ _id: { $in: user.cardIds } }).populate('content');
        const sortedCards = cards.sort((a, b) => {
            return user.cardIds.indexOf(a._id) - user.cardIds.indexOf(b._id);
        });
        console.log(sortedCards);
        res.status(200).json(sortedCards);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//gets the tasks for a given card
router.get('/api/getTasks', async (req, res) => {
    try {
        const tasks = await KanBanCardContent_1.KanBanCardContent.find();
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//updates a task, timestamp is not given by the request but is handled only in the backend and
//send to the frontend
router.post('/api/editTask', async (req, res) => {
    try {
        const { _id, title, content, status } = req.body;
        console.log(_id);
        const updatedTask = await KanBanCardContent_1.KanBanCardContent.findByIdAndUpdate(_id, {
            title: title,
            content: content,
            status: status,
            timeStamp: new Date() // Set the timeStamp to the current time
        }, { new: true });
        if (!updatedTask) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/api/deleteTask', async (req, res) => {
    try {
        const { _id, title, description } = req.body;
        console.log(_id);
        const task = await KanBanCardContent_1.KanBanCardContent.findByIdAndDelete(_id, { title, description });
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully', task });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.default = router;
