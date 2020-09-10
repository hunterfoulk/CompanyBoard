import { useState } from "react";

const useInput = (defaultValue) => {
  const [value, setValue] = useState(defaultValue);

  const onChange = (e) => setValue(e.target.value);
  console.log(value);
  return { value, setValue, onChange };
};

export default useInput;
