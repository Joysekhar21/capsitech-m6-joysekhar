
export function CheckboxDemo({ label, setShowPassword, uniqueId, disabled }) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={uniqueId}
        disabled={disabled}
        onChange={() => setShowPassword((prev) => !prev)}
        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white disabled:cursor-not-allowed disabled:opacity-50"
      />
      <label
        htmlFor={uniqueId}
        className="text-sm font-medium leading-none select-none"
      >
        {label}
      </label>
    </div>
  );
}
