import { Select } from "flowbite-react";
import { Months } from "./Constants";

const MonthSelect = ({ name, onChange, value, disabled }) => {
  return (
    <Select
      name={name}
      value={value}
      onChange={(e) => onChange(e)}
      className=""
      disabled={disabled}
    >
      {Months.map((m) => (
        <option key={m.id} value={m.id}>
          {m.name}
        </option>
      ))}
    </Select>
  );
};

export default MonthSelect;
