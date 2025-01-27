import React from "react";
import { Card, CardContent, Typography, Grid2, Button } from '@mui/material';
import './Board.css';
import CardEntry from './CardEntry';


interface cardContent {
    title: string;
    content: string;
    status: string;
}

interface KanBanEntry {
    id: number;
    title: string;
    content: cardContent[];
    status: string;
}


interface BoardProps {
    cards: KanBanEntry[];
}

const Board: React.FC<BoardProps> = ({ cards }) => {
    
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
        </Grid2>
    )
}
export default Board