import React from "react";
import "./CardEntry.css";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Typography } from "@mui/material";


interface Task {
    _id?: string;
    title: string;
    content: string;
    status: string;
}


interface CardProps {
    task: Task;
    onStatusChange: () => void;
    onTaskDeleted: (taskId: string) => void;
}



const Card: React.FC<CardProps> = ({ task, onStatusChange, onTaskDeleted }) => {
    
    
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
    
    
    return (
        <div className={`card ${task.status}`}>
            <div className = "taskHeader">
                
                <Typography variant="h5" component="h2" style={{ flexGrow: 1 }}>
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
                        <MenuItem onClick={handleClose}>Edit Task</MenuItem>
                        <MenuItem onClick={handleDeleteTask}>Delete Task</MenuItem>
                    </Menu>
                </div>
            </div>
            <div className="statusUpdateArea" onClick={onStatusChange}>
                <p>{task.content}</p>
            </div>
            
        </div>
    )
}

export default Card