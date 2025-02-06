import React, { useEffect } from "react";
import { Card, CardContent, Typography, Grid2, Button } from '@mui/material';
import './Board.css';
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

    const handleAddCard = async () => {
        var randomId = Math.floor(Math.random() * 1000);
        const newCard = {id: randomId, title: "New Card", content: [], status: "todo"};
        
        try {
            const response = await fetch('/api/addNewCard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCard)
            });
            const data = await response.json();
            console.log("card to be added: ", data);
            setCards([...cards, data.kanBanCard]);
        }catch (error) {
            console.log("card adding failed:", error);
        }
    }

    const handleUpdateCard = async (updatedCard: IKanBanCard) => {
        console.log("updated card", updatedCard);
        setCards((prevCards) =>
            prevCards.map((card) => (card.id === updatedCard.id ? updatedCard : card))
        );
        console.log(cards)
        try{
            const res = await fetch('/api/updateCard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedCard)
            });
            if (res.ok) {
                const data = await res.json();
                console.log("card udpated", data);
            }else{
                console.log("card updating failed");
            }
        }catch (error) {
            console.log("card updating failed:", error);
        }
      };

    return (
        <Grid2 container spacing={2} className="boardGrid">
            {cards.map((card) => (
                <KanBanCard key={card.id} card={card} onUpdateCard={handleUpdateCard} />
            ))}
            <Button variant="contained" className="addCardButton" onClick={handleAddCard}>Add card</Button>
        </Grid2>
    )
}
export default Board