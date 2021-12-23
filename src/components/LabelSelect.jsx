import { useFormContext } from "react-hook-form";

const LabelSelect = ({ label, options, validation, ...rest }) => {
  //Standaard select element die gebruikt zal worden bij de formulieren

  const { register, errors } = useFormContext();
  return (
    <div className="col-span-6 sm:col-span-3">
      <label htmlFor={label}>
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </label>
      <select
        {...register(label, validation)}
        {...rest}
        id={label}
        name={label}
      >
        <option value="">--kies een {label}--</option>
        {options.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      {errors[label] && (
        <p className="text-red-600 text-2xl">{errors[label].message}</p>
      )}
    </div>
  );
};

export default LabelSelect;
