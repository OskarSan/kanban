import React from "react";
import { Card, CardContent, Typography, Grid2, Button } from '@mui/material';
import CardEntry from './CardEntry';


interface kanBanCardContent {
    _id?: string;
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
    onUpdateCard: (updatedCard: CardProps['card']) => void;
}

const KanBanCard: React.FC<CardProps> = ({card, onUpdateCard}) => {

    const [tasks, setTasks] = React.useState<kanBanCardContent[]>(card.content);




    //TODO
    const handleAddTask = async () => {
        const newTask = {title: "New Task", content: "New Content", status: "todo"};
        
        try{
            const response = await fetch('/api/addNewTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask)
            });
    
            const data = await response.json();
            setTasks([...tasks, data.kanBanCardContent]);
            onUpdateCard({...card, content: [...card.content, data.kanBanCardContent]});
        
        }catch (error: any) {
            console.log("task adding failed:",error);
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
