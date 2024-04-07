import { useEffect, useState } from "react";

function useDebounce(ms) {
  const [value, setValue] = useState("");
  const [debounceValue, setDebounceValue] = useState("");
  useEffect(() => {
    const to = setTimeout(() => {
      setValue(debounceValue);
    }, ms);
    return () => {
      clearTimeout(to);
    };
  }, [debounceValue, ms]);
  return [value, setDebounceValue];
}

export default useDebounce;
