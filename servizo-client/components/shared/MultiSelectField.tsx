import Select from "react-select";

type Option = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  name: string;
  selectedValues: string[];
  onChange: (values: string[]) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  disabled?: boolean;
  error?: string;
};

export const MultiSelectField = ({
  label,
  name,
  selectedValues,
  onChange,
  options,
  placeholder,
  disabled = false,
  error,
}: Props) => {
  const selectOptions: Option[] = options;

  const selectedOptions = selectOptions.filter((opt) =>
    selectedValues?.includes(opt.value)
  );

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <Select
        isMulti
        isDisabled={disabled}
        value={selectedOptions}
        onChange={(selected) => onChange(selected.map((opt) => opt.value))}
        options={selectOptions}
        placeholder={placeholder}
        name={name}
        classNamePrefix="react-select"
        className={error ? "border border-red-500 rounded" : ""}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};
