import React, {useEffect} from "react";
import { Card, CardContent, Typography, Grid2, Button, Menu, MenuItem, IconButton} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CardEntry from './CardEntry';
import './KanBanCard.css';


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

    const [tasks, setTasks] = React.useState<kanBanCardContent[]>([]);

    useEffect(() => {
        setTasks(card.content);
    }, [card.content]);

    
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
            console.log("task to be added: ", data.kanBanCardContent);
            setTasks([...tasks, data.kanBanCardContent]);

            console.log("tasks: ",tasks)
            onUpdateCard({...card, content: [...card.content, data.kanBanCardContent]});
        
        }catch (error: any) {
            console.log("task adding failed:",error);
        }
    };

    const handleStatusChange = (taskId: string) => {
        const updatedTasks = tasks.map(task => {
            if (task._id === taskId) {
                let newStatus;
                switch (task.status) {
                    case 'todo':
                        newStatus = 'in-progress';
                        break;
                    case 'in-progress':
                        newStatus = 'done';
                        break;
                    case 'done':
                        newStatus = 'todo';
                        break;
                    default:
                        newStatus = 'todo';
                }
                return { ...task, status: newStatus };
            }
            return task;
        });
        setTasks(updatedTasks);
        onUpdateCard({ ...card, content: updatedTasks });
    };

    //menu
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
        <Grid2 key={card.id} className="cardGrid">
            <Card className="kanBanCard">
                <div className="cardHeader">
                        <Typography variant="h5" component="h2" style={{ flexGrow: 1 }}>
                            {card.title}
                        </Typography>
                        {/*edit card button*/}
                    <div>
                        <IconButton style={{paddingRight: 30 }}
                            id="demo-positioned-button"
                            aria-controls={open ? 'demo-positioned-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="demo-positioned-menu"
                            aria-labelledby="demo-positioned-button"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                            }}
                            transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                            }}
                        >
                            <MenuItem onClick={handleClose}>Edit card</MenuItem>
                            <MenuItem onClick={handleClose}>Delete card</MenuItem>
                        </Menu>
                    </div>
                </div>  
                <CardContent className="cardContent">
                    {card.content.map((entry, index) => (
                        <CardEntry key={index} title={entry.title} content={entry.content} status={entry.status} onStatusChange={() => handleStatusChange(entry._id!)} />
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
