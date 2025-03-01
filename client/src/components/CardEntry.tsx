//dialog code from: https://mui.com/material-ui/react-dialog/


import React from "react";
import "./CardEntry.css";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";



interface Task {
    _id?: string;
    title: string;
    content: string;
    status: string;
    timeStamp: string;
}


interface CardProps {
    task: Task;
    onStatusChange: () => void;
    onTaskDeleted: (taskId: string) => void;
    onTaskUpdated: (updatedTask: Task) => void;
    onDragStartTask: (taskId: string) => void;
    onDragOverTask: (event: React.DragEvent<HTMLDivElement>) => void;
    onDropTask: (event: React.DragEvent<HTMLDivElement>, taskId: string) => void;
}



const Card: React.FC<CardProps> = ({ task, onStatusChange, onTaskDeleted, onTaskUpdated, onDragStartTask: onDragStartTask, onDragOverTask: onDragOverTask, onDropTask: onDropTask}) => {
    
    //menu
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const handleDeleteTask = async () => {
        const res = await fetch('/api/deleteTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({_id: task._id})
        });

        if (res.ok) {
            onTaskDeleted(task._id!);
        }
        setAnchorEl(null);
        
    }
    
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedTask, setEditedTask] = React.useState<Task>({...task})
    
    const handleEditTask = () => {
        setIsEditing(true);
        setAnchorEl(null);
    }


    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedTask({...editedTask, [e.target.name]: e.target.value});
    };


    const handleEditSave = async () => {
        try{
            const res = await fetch('/api/editTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editedTask)
            });
    
            if (res.ok) {
                const updatedTask = await res.json();
                onTaskUpdated(updatedTask.task);
                setIsEditing(false);
            };
    
        }catch(error: any){
            console.log(error);
        }

    }

    const handleEditCancel = () => {
        setIsEditing(false);
        setEditedTask({...task});
    };

    const formattedTimeStamp = new Date(task.timeStamp).toLocaleString();

    return (
        <div
            className={`card ${task.status}`}
            draggable="true"
            onDragStart={(event) => { event.stopPropagation(); onDragStartTask(task._id!); }}
            onDragOver={(event) => { event.stopPropagation(); onDragOverTask(event); }}
            onDrop={(event) => { event.stopPropagation(); onDropTask(event, task._id!); }}
        >    
            <div className = "taskHeader">

                <Typography id="headerText" variant="h5" component="h2" style={{ flexGrow: 1}}>
                    {task.title}
                </Typography>
                
                <div>
                    <IconButton style={{paddingRight: 10 }}
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
                        <MenuItem onClick={handleEditTask}>Edit Task</MenuItem>
                        <MenuItem onClick={handleDeleteTask}>Delete Task</MenuItem>
                    </Menu>
                </div>
                
            </div>
            <div className="statusUpdateArea" onClick={onStatusChange}>
                <p className="statusText">Status: {task.status}</p>
                <p className="dateText">last edit: {formattedTimeStamp}</p>
                <p className="taskContent">{task.content}</p>
                
            </div>

            {/*Edit Task Dialog*/}
            <Dialog open={isEditing} onClose={handleEditCancel}>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Title"
                        name="title"
                        value={editedTask.title}
                        onChange={handleEditChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Content"
                        name="content"
                        value={editedTask.content}
                        onChange={handleEditChange}
                        fullWidth
                        multiline
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
        </div>
    )
}

export default Card