import SearchBar from './SearchBar.active';
import SearchBarLoading from './SearchBar.loading';

function SearchBarComponent( props ) {
  if (props.loading) {
    return <SearchBarLoading props />;
  }

  return (
    <>
      <SearchBar props={props} />
    </>
  );
}

export default SearchBarComponent;
