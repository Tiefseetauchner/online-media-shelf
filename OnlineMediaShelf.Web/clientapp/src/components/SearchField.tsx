import {
  useCallback,
  useEffect,
  useState
} from 'react';
import {
  Input,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  tokens,
  Tree,
  TreeItem
} from '@fluentui/react-components';
import {
  debounce
} from "lodash";

export interface SuggestionType<T> {
  name: string;
  value: T
}

interface SearchFieldProps<T> {
  fetchSuggestionsDelegate: (query: string) => Promise<SuggestionType<T>[]>;
  selectionPressed: (selection: T) => void;
}

interface SearchFieldInputState<T> {
  input: string;
  suggestions: SuggestionType<T>[];
}

function SearchField<T>(props: SearchFieldProps<T>) {
  const [state, setState] = useState<SearchFieldInputState<T>>({
    input: "",
    suggestions: []
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchSuggestions = useCallback(
    debounce(async query => {
      const result = await props.fetchSuggestionsDelegate(query);
      setState({
        ...state,
        suggestions: result,
      });
    }, 200, {leading: true}), [state.input]);

  useEffect(() => {
    fetchSuggestions(state.input);
  }, [state.input]);

  function selectionPressed(item: SuggestionType<T>) {
    props.selectionPressed(item.value);
    setState({
      ...state,
      input: item.name,
    });
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % state.suggestions!.length);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) => (prevIndex - 1 + state.suggestions!.length) % state.suggestions!.length);
      e.preventDefault();
    } else if (e.key === 'Enter') {
      selectionPressed(state.suggestions[selectedIndex]);
      e.preventDefault();
    }
  };

  return (
    <>
      <Input
        autoComplete={"off"}
        placeholder="Search"
        onChange={(e) => setState({
          ...state,
          input: e.target.value
        })}
        onKeyDown={handleKeyDown}
        value={state.input}
        onFocus={() => state && setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 500)}/>

      <Popover
        open={isOpen}
        positioning={"below-start"}
        trapFocus={false}
        unstable_disableAutoFocus={true}>
        <PopoverTrigger>
          <div></div>
        </PopoverTrigger>
        <PopoverSurface>
          <Tree
            aria-label={"suggestion-tree"}>
            {state.suggestions?.map((item, index) => (
              <TreeItem
                key={index}
                itemType={"leaf"}
                style={{
                  backgroundColor: index === selectedIndex ? tokens.colorNeutralBackground1Hover : tokens.colorNeutralBackground1,
                  padding: "5px"
                }}
                onClick={() => selectionPressed(item)}>{item.name}</TreeItem>
            ))}
          </Tree>
        </PopoverSurface>
      </Popover>
    </>
  );
}

export default SearchField;