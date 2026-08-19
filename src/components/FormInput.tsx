interface FormInputProps {
  label: string;
  type: string;
  name: string;
  placeholder: string;
}

function FormInput({
  label,
  type,
  name,
  placeholder,
}: FormInputProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>

      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
      />
    </div>
  );
}

export default FormInput;