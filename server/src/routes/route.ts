import {Router, Request, Response} from 'express'; 
import { KanBanCard, IKanBanCard } from '../models/KanBanCard';
import { KanBanCardContent, IKanBanCardContent } from '../models/KanBanCardContent';

const router: Router = Router();

router.post('/api/addCard', async (req: Request, res: Response) => {
    try {
        //create the kanban card content objects
        const contentPromises = req.body.content.map(async (entry: IKanBanCardContent) => {
            const kanBanCardContent = new KanBanCardContent(entry);
            await kanBanCardContent.save();
            return kanBanCardContent._id;
        });
        const contentIds = await Promise.all(contentPromises);


        const kanBanCard: IKanBanCard = new KanBanCard({
            id: req.body.id,
            title: req.body.title,
            content: contentIds,
            status: req.body.status
        });
        await kanBanCard.save();
        res.status(200).json({message: 'Card added successfully'});

    }catch(error: any) {
        res.status(500).json({message: error.message});
    }




});



export default router