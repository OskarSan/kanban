import React, { useEffect } from "react";
import { Card, CardContent, Typography, Grid2, Button } from '@mui/material';
import './Board.css';
import CardEntry from './CardEntry';


interface kanBanCardContent {
    title: string;
    content: string;
    status: string;
}

interface KanBanCard {
    id: number;
    title: string;
    content: kanBanCardContent[];
    status: string;
}


const Board: React.FC = () => {
    
    const [cards, setCards] = React.useState<KanBanCard[]>([]);
    
    useEffect(() => {

        const fetchCards = async () => {
            try {
                const response = await fetch('/api/getCards');
                const data = await response.json();
                setCards(data);
            }catch (error) {
                console.log(error);
            }
        };
        fetchCards();
    }, []);


    

    return (
        <Grid2 container spacing={2} className="boardGrid">
            {cards.map((card) => (
                <Grid2 key={card.id} className="cardGrid">
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {card.title}
                            </Typography>
                            {card.content.map((entry, index) => (
                                <CardEntry key={index} title={entry.title} content={entry.content} status={entry.status} />
                            ))}
                        </CardContent>
                        <div className="buttonContainer">
                            <Button variant="contained" className="addTaskButton">Add task</Button>
                        </div>
                    </Card>
                </Grid2>
            ))}
            <Button variant="contained" className="addCardButton">Add card</Button>
        </Grid2>
    )
}
export default Board