"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const KanBanCard_1 = require("../models/KanBanCard");
const KanBanCardContent_1 = require("../models/KanBanCardContent");
const router = (0, express_1.Router)();
router.post('/api/addCard', async (req, res) => {
    try {
        //create the kanban card content objects
        const contentPromises = req.body.content.map(async (entry) => {
            const kanBanCardContent = new KanBanCardContent_1.KanBanCardContent(entry);
            await kanBanCardContent.save();
            return kanBanCardContent._id;
        });
        const contentIds = await Promise.all(contentPromises);
        const kanBanCard = new KanBanCard_1.KanBanCard({
            id: req.body.id,
            title: req.body.title,
            content: contentIds,
            status: req.body.status
        });
        await kanBanCard.save();
        res.status(200).json({ message: 'Card added successfully' });
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
        const updatedCard = await KanBanCard_1.KanBanCard.findByIdAndUpdate(_id, {
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
router.get('/api/getCards', async (req, res) => {
    try {
        const cards = await KanBanCard_1.KanBanCard.find().populate('content');
        res.status(200).json(cards);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/api/getTasks', async (req, res) => {
    try {
        const tasks = await KanBanCardContent_1.KanBanCardContent.find();
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.default = router;
