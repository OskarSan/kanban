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
exports.default = router;
