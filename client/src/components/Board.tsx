import React, { useEffect } from "react";
import { Card, CardContent, Typography, Grid2, Button } from '@mui/material';
import './Board.css';
import CardEntry from './CardEntry';
import KanBanCard from './KanBanCard';

interface kanBanCardContent {
    title: string;
    content: string;
    status: string;
}

interface IKanBanCard {
    id: number;
    title: string;
    content: kanBanCardContent[];
    status: string;
}


const Board: React.FC = () => {
    
    const [cards, setCards] = React.useState<IKanBanCard[]>([]);
    
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
                <KanBanCard key={card.id} card={card}  />
            ))}
            <Button variant="contained" className="addCardButton">Add card</Button>
        </Grid2>
    )
}
export default Board