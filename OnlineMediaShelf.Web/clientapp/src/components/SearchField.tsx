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
  Tree,
  TreeItem
} from '@fluentui/react-components';
import {
  debounce,
  uniqueId
} from "lodash";

export interface SuggestionType<T> {
  name: string;
  value: T
}

interface SearchFieldProps<T> {
  fetchSuggestionsDelegate: (query: string) => Promise<SuggestionType<T>[]>;
  selectionPressed: (selection: T) => void;
  value: string;
}

interface SearchFieldInputState<T> {
  input: string;
  suggestions?: SuggestionType<T>[];
}

function SearchField<T>(props: SearchFieldProps<T>) {
  const [state, setState] = useState<SearchFieldInputState<T>>({input: ""});
  const [isOpen, setIsOpen] = useState(false);
  const inputFieldId = uniqueId()

  const fetchSuggestions = useCallback(
    debounce(async query => {
      if (query === "")
        return;

      const result = await props.fetchSuggestionsDelegate(query);
      setState({
        ...state,
        suggestions: result,
      });
      setIsOpen(true);
    }, 200, {leading: true}), [state.input]);

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

  return (
    <>
      <Input
        id={inputFieldId}
        autoComplete={"off"}
        placeholder="Search"
        onChange={(e) => setState({
          ...state,
          input: e.target.value
        })}
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
                onClick={() => selectionPressed(item)}>{item.name}</TreeItem>
            ))}
          </Tree>
        </PopoverSurface>
      </Popover>
    </>
  );
}

export default SearchField;