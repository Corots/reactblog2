import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useAppDispatch } from '../../redux/store';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { favoriteFilter } from '../../redux/favorite/selectors';
import { addBookmark, addFavorite } from '../../redux/favorite/slice';



const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


const  IconCheckboxes  : React.FC<{ articleId : string }> = ({articleId}) => {

  const dispatch = useAppDispatch();
  const {idFavorites, idBookmarks} = useSelector(favoriteFilter);

  

  const handleFav =() => {
    dispatch(addFavorite(articleId))
  }

  const handleBook = () => {
    dispatch(addBookmark(articleId))
  }

  return (
    <div>
      <Checkbox 
        {...label} 
        icon={<FavoriteBorder />} 
        checkedIcon={<Favorite />} 
        sx={{color: "whitesmoke"}}
        onClick = {handleFav} 
        checked = {idFavorites.includes(articleId)}
         
        />
      <Checkbox
        {...label}
        icon={<BookmarkBorderIcon />}
        checkedIcon={<BookmarkIcon />}
        sx={{color: "whitesmoke"}}
        onClick = {handleBook} 
        checked = {idBookmarks.includes(articleId)}

        

        
        
      />
    </div>
  );
}

export default IconCheckboxes;