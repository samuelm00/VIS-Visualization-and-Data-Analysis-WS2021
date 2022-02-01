import React, { useState } from "react";
import Autosuggest from "react-autosuggest";
import { useDataSet } from "../../hooks/hook.dataset";

export default function LocationAutocomplete() {
  const dataSet = useDataSet();
  const [value, setValue] = useState("");
  const [locations, setLocations] = useState<string[]>(
    dataSet.map((d) => d.location)
  );
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);

  const getSuggestions = (value: string) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : locations.filter(
          (lang) => lang.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  const onChange = (
    event: React.FormEvent<HTMLElement>,
    { newValue }: Autosuggest.ChangeEvent
  ) => {
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }: any) => {
    setFilteredLocations(value);
  };

  const onSuggestionsClearRequested = () => {
    setFilteredLocations([]);
  };

  const renderSuggestion = (suggestion: string) => <div>{suggestion}</div>;

  return (
    <Autosuggest
      suggestions={filteredLocations}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={(value) => value}
      renderSuggestion={renderSuggestion}
      inputProps={{ value, onChange }}
    />
  );
}
