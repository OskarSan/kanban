import React, { useEffect, useState } from "react";
import { Grid2, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Board.css';
import KanBanCard from './KanBanCard';
import Header from './Header';

interface kanBanCardContent {
    title: string;
    content: string;
    status: string;
    timeStamp: string;
}

interface IKanBanCard {
    _id?: any;
    id: number;
    title: string;
    content: kanBanCardContent[];
    status: string;
}


const Board: React.FC = () => {
    
    const [cards, setCards] = React.useState<IKanBanCard[]>([]);
    const [filteredCards, setFilteredCards] = useState<IKanBanCard[]>([]);
    const [fetchTrigger, setFetchTrigger] = useState(false);
    const [draggedCardId, setDraggedCardId] = useState<number | null>(null);
    const token = localStorage.getItem('auth_token');
    const navigate = useNavigate();

    useEffect(() => {
        //fetches the cards based on the token happens when the page is loaded, token is updated or a card is deleted
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
                    console.log(data)
                    setCards(data);
                    setFilteredCards(data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchCards();
    }, [token, navigate, fetchTrigger]);

    
    const handleAddCard = async () => {
        //gives card a random id and adds it to the database. Not necessarily needed because of the mongo indexing
        //but i dont want to touch it currently in the fear of god.
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
                setFilteredCards([...filteredCards, data.kanBanCard]);
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
        setFilteredCards((prevCards) =>
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

    const handleUpdateCardsOrder = async (updatedCards: IKanBanCard[]) => {
        try{
            const newOrder = updatedCards.map(card => card._id);
            console.log(newOrder)
            const res = await fetch('/api/updateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({newOrder})
            });
            if (res.ok) {
                console.log("cards order updated", res);
            } else {
                console.log("cards order updating failed", res);
            }
        }catch (error : any) {
            console.log("cards order updating failed:", error);
        }
    };


    const handleCardDeleted = () => {
        setFetchTrigger(!fetchTrigger);
    };


    //drag and drop functions
    const handleDragStartCard = (cardId: number) => {
        setDraggedCardId(cardId);
    };
    
    const handleDragOverCard = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    //fancy looking drop function, syntax asked from Copilot :)
    //handles the indexing of the card when dropped
    const handleDropCard = (e: React.DragEvent<HTMLDivElement>, targetCardId: number) => {
        e.preventDefault();
        if(draggedCardId ===null) return;
        console.log(cards)
        const draggedCardIndex = cards.findIndex((card) => card.id === draggedCardId);
        const targetCardIndex = cards.findIndex((card) => card.id === targetCardId);
        console.log(targetCardId)
        if (draggedCardIndex === -1 || targetCardIndex === -1) return;

        const updatedCards = [...cards];
        const [draggedCard] = updatedCards.splice(draggedCardIndex, 1);
        updatedCards.splice(targetCardIndex, 0, draggedCard);
        console.log(updatedCards)
        setCards(updatedCards); 
        setFilteredCards(updatedCards);
        handleUpdateCardsOrder(updatedCards);
        setDraggedCardId(null);

    }

    const handleSearch = (query: string) => {
        if (query.trim() === '') {
            setFilteredCards(cards);
        } else {
            const filtered = cards.filter(card =>
                card.title.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredCards(filtered);
        }
    };


    return (
        <>
            <Header onSearch={handleSearch} />
            <Grid2 container spacing={2} className="boardGrid">
                {filteredCards.map((card) => (
                    <KanBanCard 
                    key={card.id} 
                    card={card} 
                    onUpdateCard={handleUpdateCard} 
                    onCardDeleted={handleCardDeleted} 
                    onDragStartCard={handleDragStartCard}
                    onDragOverCard={handleDragOverCard}
                    onDropCard={handleDropCard}
                    />
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
        </>
        
    )
}
export default Board