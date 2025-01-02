import {
  KeyboardEventHandler,
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
  debounce,
  uniqueId
} from "lodash";

export interface SuggestionType<T> {
  name: string;
  value: T;
}

interface SearchFieldProps<T> {
  placeholder?: string;
  fetchSuggestionsDelegate: (query: string) => Promise<SuggestionType<T>[]>;
  selectionPressed: (selection: T) => void;
  value: string;
  onInputChange: (value: string) => void;
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
  const inputFieldId = uniqueId()

  const fetchSuggestions = useCallback(
    debounce(async query => {
      const result = await props.fetchSuggestionsDelegate(query);
      setState(prev => ({
        ...prev,
        suggestions: result,
      }));
    }, 400, {leading: true}), [state.input]);

  useEffect(() => {
    fetchSuggestions(state.input);
  }, [state.input]);

  useEffect(() => {
    (document.getElementById(inputFieldId) as HTMLInputElement).value = props.value;
  }, [props.value]);

  function selectionPressed(item: SuggestionType<T>) {
    props.selectionPressed(item.value);
    setState({
      ...state,
      input: item.name,
    });
  }

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event: any) => {
    if (event.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % state.suggestions!.length);
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) => (prevIndex - 1 + state.suggestions!.length) % state.suggestions!.length);
      event.preventDefault();
    } else if (event.key === 'Enter') {
      selectionPressed(state.suggestions[selectedIndex]);
      setIsOpen(false);

      document.getElementById('SubmitAddItemToShelfButton')!.focus();

      event.preventDefault();
    }
  };

  return (
    <>
      <Input
        id={inputFieldId}
        autoComplete={"off"}
        placeholder={props.placeholder ?? "Search"}
        onChange={(e) => {
          setState({
            ...state,
            input: e.target.value
          });
          props.onInputChange(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        value={props.value}
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