import {Router, Request, Response} from 'express'; 
import { KanBanCard, IKanBanCard } from '../models/kanBanCard';
import { KanBanCardContent, IKanBanCardContent } from '../models/KanBanCardContent';
import { User, IUser } from '../models/User';

import {validateToken} from '../middleware/validateToken';
import mongoose from 'mongoose';


interface CustomRequest extends Request {
    user?: {
        user?:{
            id?: string;
            username?: string;
        }
        id?: string;
        _id?: string;
        username?: string;
    };
}

const router: Router = Router();

// updates the order of the users cards when dragged and dropped
router.post('/api/updateUser',validateToken, async (req: CustomRequest, res: Response) => {
    try {
        console.log(req.body);
        console.log(req.user);       
        const newOrder = req.body.newOrder;
        const userId = req.user?.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        console.log(user.cardIds);
        user.cardIds = newOrder;
        user.save();
        console.log(user.cardIds);
        res.status(200).json({message: 'Cards updated successfully'});
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }   
});

//adds a new card to the database with empty array as content
router.post('/api/addNewCard', validateToken, async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.user?.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return 
        }
        console.log(req.user);
        const kanBanCard = new KanBanCard(req.body);
        kanBanCard.createdBy = req.user?.username;
        
        console.log(kanBanCard);
        await kanBanCard.save();

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return 
        }
        user.cardIds.push(kanBanCard._id as mongoose.Types.ObjectId);
        await user.save();

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



router.post('/api/deleteCard', async (req: Request, res: Response) => {
    try{
        const { _id } = req.body;
        const card = await KanBanCard.findByIdAndDelete(_id);
        if (!card) {
            res.status(404).json({ message: 'Card not found' });
        }
        res.status(200).json({message: 'Card deleted successfully', card});
    }catch(error: any) {
        res.status(500).json({message: error.message});

    }
});

//gets all cards from the database, used by the admin account
router.get('/api/getCards', validateToken, async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const cards = await KanBanCard.find().populate('content');
        res.status(200).json(cards);
    }catch(error: any) {
        res.status(500).json({message: error.message});
    }
});


//stupid ass function which sorts the users cards based on the order of the cardIds array
//could be done in a better way for example by making a board component which is used
//inbetween user and the users cards.
router.get('/api/getUsersCards', validateToken, async (req: CustomRequest, res: Response): Promise<void> => {
    console.log("token validated to getUserCardsS")
    try {
        console.log("user: ",req.user?.user)
  
        
        const userId = req.user?.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return 
        }
        const user = await User.findById(userId)
        if (!user) {
            console.log("user not found")
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if(user.isAdmin == true){
            const cards = await KanBanCard.find().populate('content');
            res.status(200).json(cards);
            return;
        }
        const cards = await KanBanCard.find({ _id: { $in: user.cardIds } }).populate('content');
        
        const sortedCards = cards.sort((a, b) => {
            return user.cardIds.indexOf(a._id as mongoose.Types.ObjectId) - user.cardIds.indexOf(b._id as mongoose.Types.ObjectId);
        });

        console.log(sortedCards);
        res.status(200).json(sortedCards);
    
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});


//gets the tasks for a given card
router.get('/api/getTasks', async (req: Request, res: Response) => {
    try {
        const tasks = await KanBanCardContent.find();
        res.status(200).json(tasks);
    }catch(error: any) {
        res.status(500).json({message: error.message});
    }
});

//updates a task, timestamp is not given by the request but is handled only in the backend and
//send to the frontend
router.post('/api/editTask', async (req: Request, res: Response) => {
    try {
        const { _id, title, content, status } = req.body;
        console.log(_id);

        const updatedTask = await KanBanCardContent.findByIdAndUpdate(
            _id,
            {
                title: title,
                content: content,
                status: status,
                timeStamp: new Date() // Set the timeStamp to the current time
            },
            { new: true }
        );

        if (!updatedTask) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/api/deleteTask', async (req: Request, res: Response) => {

    try{
        const { _id, title, description } = req.body;
        console.log(_id)
        const task = await KanBanCardContent.findByIdAndDelete(_id, {title, description});
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({message: 'Task deleted successfully', task});
    } catch(error: any) {
        res.status(500).json({message: error.message});
    }

});



export default router