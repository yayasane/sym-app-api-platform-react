import React from 'react'

// - name
// - label
// - value
// - onchange
// - placeholder
// - type
// - error
const Field = ({
  name,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error = '',
}) => (
  <div className="mb-3">
    <label htmlFor={name}>{label}</label>
    <input
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      name={name}
      id={name}
      className={'form-control ' + (error && 'is-invalid')}
    />
    {error && <p className="invalid-feedback">{error}</p>}
  </div>
)

export default Field
