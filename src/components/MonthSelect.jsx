import { Select } from "flowbite-react";
import { Months } from "./Constants";

const MonthSelect = ({ name, onChange }) => {
  return (
    <Select
      name={name}
      // value={month}
      onChange={(e) => onChange(e)}
      className=""
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
