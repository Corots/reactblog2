import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import Delete from '@mui/icons-material/Delete';
import ContentPaste from '@mui/icons-material/ContentPaste';
import React from 'react';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';


export interface IIconMenu {
    handleEditClick: () => void;
    handleDelete: () => void;

}
const IconMenu : React.FC<IIconMenu> = ({ handleEditClick, handleDelete }) => {

    
 
  return (
    <Paper sx={{ width: 320, maxWidth: '100%',  position : "absolute"}}>
      <MenuList>

        
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <ContentCut fontSize="medium" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>


        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
    


      </MenuList>
    </Paper>
  );
}

export default IconMenu