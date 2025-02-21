import React, { useEffect } from "react";
import { Grid2, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
    const token = localStorage.getItem('auth_token');
    const navigate = useNavigate();

    useEffect(() => {

        const fetchCards = async () => {

            if(!token) {
                return;
            }
            try {
                const response = await fetch('/api/getUsersCards', {
                    headers: {
                        "authorization": `Bearer ${token}`
                    }
                });
                if (response.status === 400) {
                    // Token is expired or invalid
                    localStorage.removeItem('auth_token');
                    navigate('/login');
                } else {
                    const data = await response.json();
                    setCards(data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchCards();
    }, [token, navigate]);

    const handleAddCard = async () => {
        var randomId = Math.floor(Math.random() * 1000);
        const newCard = {id: randomId, title: "New Card", content: [], status: "todo"};
        
        try {
            const response = await fetch('/api/addNewCard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newCard)
            });
            if (response.status === 401) {
                // Token is expired or invalid
                localStorage.removeItem('auth_token');
                navigate('/login');
            } else {
                const data = await response.json();
                console.log("card to be added: ", data);
                setCards([...cards, data.kanBanCard]);
            }
        } catch (error) {
            console.log("card adding failed:", error);
        }
    }

    const handleUpdateCard = async (updatedCard: IKanBanCard) => {
        console.log("updated card", updatedCard);
        setCards((prevCards) =>
            prevCards.map((card) => (card.id === updatedCard.id ? updatedCard : card))
        );
        console.log(cards)
        try {
            const res = await fetch('/api/updateCard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedCard)
            });
            if (res.status === 401) {
                // Token is expired or invalid
                localStorage.removeItem('auth_token');
                navigate('/login');
            } else if (res.ok) {
                const data = await res.json();
                console.log("card updated", data);
            } else {
                console.log("card updating failed");
            }
        } catch (error) {
            console.log("card updating failed:", error);
        }
      };

    return (
        <Grid2 container spacing={2} className="boardGrid">
            {cards.map((card) => (
                <KanBanCard key={card.id} card={card} onUpdateCard={handleUpdateCard} />
            ))}
            {token ? (
                <Button variant="contained" className="addCardButton" onClick={handleAddCard}>
                    Add card
                </Button>
            ) : (
                <Typography variant="h5" component="h2">
                    Please login to view your cards
                </Typography>
            )}
        </Grid2>
    )
}
export default Board