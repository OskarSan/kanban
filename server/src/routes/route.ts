import {Router, Request, Response} from 'express'; 
import { KanBanCard, IKanBanCard } from '../models/KanBanCard';
import { KanBanCardContent, IKanBanCardContent } from '../models/KanBanCardContent';

const router: Router = Router();

router.post('/api/addNewCard', async (req: Request, res: Response) => {
    try {
        const kanBanCard = new KanBanCard(req.body);
        console.log(kanBanCard);
        await kanBanCard.save();
        res.status(200).json({message: 'Card added successfully', kanBanCard});

    }catch(error: any) {
        res.status(500).json({message: error.message});
    }

});


router.post('/api/addNewTask', async (req: Request, res: Response) => {

    try {
        const kanBanCardContent = new KanBanCardContent(req.body);
        console.log(kanBanCardContent);
        await kanBanCardContent.save();
        res.status(200).json({kanBanCardContent});
    }catch (error: any) {
        res.status(500).json({message: error.message});
    }


});   

//updates card content, whatever changes are made to the card
//handles also the addition of a new cardEntry

router.post('/api/updateCard', async (req: Request, res: Response) => {
    try {
        const {_id, title, content, status} = req.body;

        const contentPromises = content.map(async (entry: IKanBanCardContent) => {
            if (entry._id) {
                await KanBanCardContent.findByIdAndUpdate(entry._id, entry);
                return entry._id;
            }
        });

        const contentIds = await Promise.all(contentPromises);

        const updatedCard = await KanBanCard.findByIdAndUpdate(
            _id, 
            {
                title: title,
                content: contentIds,
                status: status
            },
            {new: true}
        );
        if (!updatedCard) {
            res.status(404).json({ message: 'Card not found' });
        }
        res.status(200).json({message: 'Card updated successfully', card: updatedCard});

    }catch (error: any) {
        res.status(500).json({message: error.message});
    }
});

router.get('/api/getCards', async (req: Request, res: Response) => {
    try {
        const cards = await KanBanCard.find().populate('content');
        res.status(200).json(cards);
    }catch(error: any) {
        res.status(500).json({message: error.message});
    }
});

router.get('/api/getTasks', async (req: Request, res: Response) => {
    try {
        const tasks = await KanBanCardContent.find();
        res.status(200).json(tasks);
    }catch(error: any) {
        res.status(500).json({message: error.message});
    }
});



export default router