import { useState, useContext, useEffect } from 'react';
import AppContext from '@/src/context/context';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/system';
import styles from './SearchBar.module.css';

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: 'white',
  backgroundColor: '#ec989d',
}));

const GroupItems = styled('ul')({
  padding: 0,
});

export default function SearchBar({ props }) {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);

  const { ctx } = useContext(AppContext);

  const handler = (value: string) => {
    ctx.query = value;
    const qCopy = { ...props.query };
    let nCopy = { ...qCopy, name: value };

    props.setQuery(nCopy);

    value ? setQuery(value.toLocaleLowerCase()) : setQuery(' ');
  };

  useEffect(() => {
    const getOptions = () => {
      const newOptions = props.searchPool.map((option, index) => {
        const firstLetter = option.name.toLowerCase().startsWith('the ')
          ? option.name[4].toUpperCase()
          : option.name[0].toUpperCase();

        return {
          ...option,
          firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
          key: index,
        };
      });
      setOptions(newOptions);
    };
    getOptions();
  }, []);

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
          handler('');
          setQuery('');
          return;
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
        <li key={params.key}>
          <GroupHeader>{params.group}</GroupHeader>
          <GroupItems onClick={(e) => handler(e.target.textContent)}>
            {params.children}
          </GroupItems>
        </li>
      )}
    />
  );
}
