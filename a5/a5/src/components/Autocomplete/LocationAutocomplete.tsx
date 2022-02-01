import React, { useState } from "react";
import Autosuggest from "react-autosuggest";
import { useCurrentLocation, useDataSet } from "../../hooks/hook.dataset";

export default function LocationAutocomplete() {
  const dataSet = useDataSet();
  const { currentLocation, setCurrentLocation } = useCurrentLocation();
  const [value, setValue] = useState("");
  const [locations] = useState<{ name: string }[]>(
    dataSet.map((d) => ({ name: d.location }))
  );
  const [filteredLocations, setFilteredLocations] = useState(locations);

  const getSuggestions = (value: string) => {
    const inputValue = value.trim().toLowerCase();

    return inputValue.length === 0
      ? []
      : locations.filter(
          ({ name }) =>
            name.toLowerCase().slice(0, inputValue.length) === inputValue
        );
  };

  const onChange = (
    event: React.FormEvent<HTMLElement>,
    { newValue }: Autosuggest.ChangeEvent
  ) => {
    if (!newValue.length) {
      setCurrentLocation("");
    }
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }: any) => {
    setFilteredLocations(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setFilteredLocations([]);
  };

  const renderSuggestion = (suggestion: { name: string }) => (
    <div>{suggestion.name}</div>
  );

  return (
    <Autosuggest
      suggestions={filteredLocations}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      onSuggestionSelected={(event, { suggestion }) => {
        setCurrentLocation(suggestion.name);
        setValue(suggestion.name);
      }}
      getSuggestionValue={(value) => value.name}
      renderSuggestion={renderSuggestion}
      inputProps={{ value, onChange, className: "input input-bordered" }}
    />
  );
}
