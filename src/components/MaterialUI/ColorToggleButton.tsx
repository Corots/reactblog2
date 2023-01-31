import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React from 'react';


import { setCommentSort } from '../../redux/comments/slice';
import { useAppDispatch } from '../../redux/store';
import { CommentSliceState, SortPropertyEnum } from '../../redux/comments/types';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { commentFilter } from '../../redux/comments/selectors';

// import {} 





export default function ColorToggleButton() {
  // const [alignment, setAlignment] = React.useState<SortPropertyEnum>(SortPropertyEnum.POPULARITY);

  // const handleChange = (
  //   event: React.MouseEvent<HTMLElement>,
  //   newAlignment: SortPropertyEnum,
  // ) => {
  //   setAlignment(newAlignment);
  // };

  const dispatch = useAppDispatch();
  const {SortProperty} = useSelector(commentFilter);


  
  const HandleLeft = () => {
    dispatch(setCommentSort({SortProperty: SortPropertyEnum.DATE}));
  }

  const HandleRight = () => {
    dispatch(setCommentSort({SortProperty: SortPropertyEnum.POPULARITY}));
  }
  
  
  return (
    <ToggleButtonGroup
      color="primary"
      // value={alignment}
      // exclusive
      // onChange={handleChange}
      // aria-label="Platform"
    >
    
      <ToggleButton value="web" onClick={HandleLeft} selected={SortProperty === SortPropertyEnum.DATE}>Latest</ToggleButton>
      <ToggleButton value="android" onClick={HandleRight} selected={SortProperty === SortPropertyEnum.POPULARITY}   >Popular</ToggleButton>
    </ToggleButtonGroup>
  );
}