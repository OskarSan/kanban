import React, {useEffect} from "react";
import { Card, CardContent, Typography, Grid2, Button, Menu, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CardEntry from './Task';

import './KanBanCard.css';

interface Task {
    _id?: string;
    title: string;
    content: string;
    status: string;
    timeStamp: string;
}

interface CardProps {
    card: {
        id: number;
        title: string;
        content: Task[];
        status: string;
        createdBy?: string;
    }
    onUpdateCard: (updatedCard: CardProps['card']) => void;
    onCardDeleted: () => void;
    onDragStartCard: (cardId: number) => void;
    onDragOverCard: (event: React.DragEvent<HTMLDivElement>) => void;
    onDropCard: (event: React.DragEvent<HTMLDivElement>, targetCardId: number) => void;
    
}


const KanBanCard: React.FC<CardProps> = ({card, onUpdateCard, onCardDeleted, onDragStartCard, onDragOverCard, onDropCard}) => {

    const [tasks, setTasks] = React.useState<Task[]>([]);
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedTitle, setEditedTitle] = React.useState(card.title);
    const [draggedTaskId, setDraggedTaskId] = React.useState<string | null>(null);


    //sets the tasks to the card content
    useEffect(() => {
        setTasks(card.content);
    }, [card.content]);

    
    //creates a new task, gives it default values and adds it to the card
    const handleAddTask = async () => {
        const newTask = {title: "New Task", content: "New Content", status: "todo", timeStamp: new Date()};

        try{
            const response = await fetch(`${import.meta.env.VITE_BOARD_SERVICE_URL}/api/addNewTask`, {
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

    //handles the changing of the cards status when clicked
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

    const handleTaskDeleted = (taskId: string) => {
        const updatedTasks = tasks.filter(task => task._id !== taskId);
        setTasks(updatedTasks);
        onUpdateCard({ ...card, content: updatedTasks });
    };

    const handleTaskUpdated = (updatedTask: Task) => {
        /*vvv fancy syntax asked from chatGPT :) vvv*/
        const updatedTasks = tasks.map(task => task._id === updatedTask._id ? updatedTask : task);
        setTasks(updatedTasks);
        onUpdateCard({ ...card, content: updatedTasks });
    };

    //drag and drop
    const handleDragStartTask = (taskId: string) => {
        setDraggedTaskId(taskId);
    };

    const handleDragOverTask = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    //handles the dropping of the tasks and makes sure that the tasks are in the correct order
    //syntax asked from chatGPT :)
    const handleDropTask = (event: React.DragEvent<HTMLDivElement>, targetTaskId: string) => {
        event.preventDefault();
        if (draggedTaskId === null) return;

        const draggedTaskIndex = tasks.findIndex(task => task._id === draggedTaskId);
        const targetTaskIndex = tasks.findIndex(task => task._id === targetTaskId);

        if (draggedTaskIndex === -1 || targetTaskIndex === -1) return;

        const updatedTasks = [...tasks];
        const [draggedTask] = updatedTasks.splice(draggedTaskIndex, 1);
        updatedTasks.splice(targetTaskIndex, 0, draggedTask);

        setTasks(updatedTasks);
        onUpdateCard({ ...card, content: updatedTasks });
        setDraggedTaskId(null);
    };

    //menu

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    

    //opens the popup menu
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    
    const handleEditCard = () => {
        setIsEditing(true);
        setAnchorEl(null);  
    }


    const handleDeleteCard = async () => {
        const res = await fetch(`${import.meta.env.VITE_BOARD_SERVICE_URL}/api/deleteCard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(card)
        });
        const data = await res.json();
        console.log(data);

        onCardDeleted();
        setAnchorEl(null);
    }

    //closes the popup menu
    const handleClose = () => {
        setAnchorEl(null);
    };


    /*dialog config*/
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedTitle(e.target.value);
    };

    const handleEditSave = async () => {
        const updatedCard = { ...card, title: editedTitle };
        try {
            const res = await fetch(`${import.meta.env.VITE_BOARD_SERVICE_URL}/api/updateCard`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedCard)
            });

            if (res.ok) {
                onUpdateCard(updatedCard);
                setIsEditing(false);
            };

        } catch (error: any) {
            console.log(error);
        }
    };

    const handleEditCancel = () => {
        setIsEditing(false);
        setEditedTitle(card.title);
    };

    return (
        <Grid2 key={card.id} className="cardGrid">
            <Card 
                className="kanBanCard"
                draggable="true"
                onDragStart={() => onDragStartCard(card.id)}
                onDragOver={onDragOverCard}
                onDrop={(event) => onDropCard(event, card.id)}
            >
                {/*if user is admin, shows the owner of the card*/}
                {localStorage.getItem('isAdmin') === 'true' && (
                    <Typography variant="h6" component="h1" sx={{ flexGrow: 1, fontSize: '0.875rem' }}>
                        Created By: {card.createdBy}
                    </Typography>
                )}
                
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
                            <MenuItem onClick={handleEditCard}>Edit card</MenuItem>
                            <MenuItem onClick={handleDeleteCard}>Delete card</MenuItem>
                        </Menu>
                    </div>
                </div>  
                
                <CardContent className="cardContent">
                    {card.content.map((entry) => (
                       <React.Fragment key={entry._id}>
                            <CardEntry
                            key={entry._id}
                            task={entry}
                            onStatusChange={() => handleStatusChange(entry._id!)}
                            onTaskDeleted={handleTaskDeleted}
                            onTaskUpdated={handleTaskUpdated}
                            onDragStartTask={handleDragStartTask}
                            onDragOverTask={handleDragOverTask}
                            onDropTask={handleDropTask}
                            />
                       </React.Fragment>
                    ))}
                    
                </CardContent>
                <div className="buttonContainer">
                    <Button variant="contained" className="addTaskButton" onClick={handleAddTask}>Add task</Button>
                </div>
            </Card>

             {/* Edit Card Dialog */}
             <Dialog open={isEditing} onClose={handleEditCancel}>
                <DialogTitle>Edit Card</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Title"
                        name="title"
                        value={editedTitle}
                        onChange={handleEditChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid2>
    )
}

export default KanBanCard;
