export const FormElement = ({
  name,
  autoComplete = null,
  type = 'text',
  title,
  value = null,
  disabled = false,
  required = true,
  placeholder = '',
}) => {
  return (
    <div className="pb-4">
      <label htmlFor="email" className=" text-sm font-medium leading-5 text-gray-700">
        {title}
      </label>
      <div className="mt- rounded-md shadow-sm">
        <input
          id={name}
          type={type}
          disabled={disabled}
          tabIndex={1}
          name={name}
          autoComplete={autoComplete}
          value={value ? value : undefined}
          placeholder={placeholder}
          required={required}
          className={`block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out
                border border-gray-300 rounded-md appearance-none focus:outline-none
                focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5
                ${disabled ? 'text-gray-500' : ''}
                `}
        />
      </div>
    </div>
  )
}
