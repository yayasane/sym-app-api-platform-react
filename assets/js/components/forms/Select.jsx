import React from 'react'

const Select = ({ name, value, onChange, error = '', label, children }) => (
  <div className="mb-3">
    <label htmlFor={name}>{label}</label>
    <select
      className={'form-control' + (error && ' is-invalid')}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
    >
      {children}
    </select>
    <p className="invalid-feedback">{error}</p>
  </div>
)

export default Select
