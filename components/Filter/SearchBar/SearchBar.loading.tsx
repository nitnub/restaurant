import { useState, useContext } from 'react';
import AppContext from '@/components/context';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled, lighten, darken } from '@mui/system';
import styles from './SearchBar.module.css';
import { Skeleton } from '@mui/material';

export default function SearchBarLoading(props) {
  
    return <Skeleton  variant="rounded" className={styles.searchBarLoading}/>
  
}
