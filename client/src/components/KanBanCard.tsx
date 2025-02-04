import React from "react";
import { Card, CardContent, Typography, Grid2, Button } from '@mui/material';
import CardEntry from './CardEntry';


interface kanBanCardContent {
    title: string;
    content: string;
    status: string;
}

interface CardProps {
    card: {
        id: number;
        title: string;
        content: kanBanCardContent[];
        status: string;
    }
    
}


const KanBanCard: React.FC<CardProps> = ({card}) => {



    //TODO
    const handleAddTask = async () => {
        const newTask = {
            title: "New task",
            content: "New task content",
            status: "todo"
        }
        card.content.push(newTask);


        try{
            const res = await fetch('/api/updateCard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: card.id,
                    title: card.title,
                    content: card.content,
                    status: card.status
                })
            });

            if (res.ok) {
                const data = await res.json();
                console.log('Task added successfully');
                
            }else {
                console.error('Task not added');
            }

        }catch (error) {
            console.log(error);
        }
    };



    return (
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
                    <Button variant="contained" className="addTaskButton" onClick={handleAddTask}>Add task</Button>
                </div>
            </Card>
        </Grid2>
    )
}

export default KanBanCard;
