import { useState, useContext } from 'react';
import AppContext from '@/components/context';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled, lighten, darken } from '@mui/system';
import styles from './SearchBar.module.css';

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: 'white',
  backgroundColor: 'purple',
}));

const GroupItems = styled('ul')({
  padding: 0,
});

export default function SearchBar(props) {
  const [query, setQuery] = useState('');
  const ctx = useContext(AppContext);

  const handler = (value: string) => {
    ctx.query = value;
    const qCopy = {...props.query}
    let nCopy = {...qCopy, name: value}

    props.setQuery(nCopy);

    value ? setQuery(value.toLocaleLowerCase())
     : setQuery(' ')
  };
  const options = props.searchPool.map((option) => {
    let firstLetter = '';
      if (option.name.toLowerCase().startsWith('the') && option.name.length > 3) {
      firstLetter = option.name[4].toUpperCase();
    } else {
      firstLetter = option.name[0].toUpperCase();
    }

    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
      key: option.id,
    };
  });

  return (
    <Autocomplete
      className={styles.searchBar}
      id="search-bar"
      // disableClearable
      options={options.sort(
        (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
      )}
      groupBy={(option) => option.firstLetter}
      getOptionLabel={(option) => option.name}
      sx={{ width: 300 }}

      onInputChange={(event, newInputValue, reason) => {
        if (reason === 'clear') {
          handler('')
          setQuery('')
          return
        } else {
          // setQuery('')
        }
      }}

      renderInput={(params) => (
        <TextField
          value={query}
          onChange={(e) => handler(e.target.value)}
          onBlur={(e) => handler(e.target.value)}
          {...params}
          label={props.label}
        />
      )}
      renderGroup={(params) => (
        <li>
          <GroupHeader>{params.group}</GroupHeader>
          <GroupItems onClick={(e) => handler(e.target.textContent)}>
            {params.children}
          </GroupItems>
        </li>
      )}
    />
  );
}

