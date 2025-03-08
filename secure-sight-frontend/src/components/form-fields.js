import { ErrorMessage, Field, getIn, setIn } from "formik"
import ReactDatePicker from "react-datepicker"
import { FormFeedback, FormGroup, FormText, Input, Label } from "reactstrap"

export const InputField = ({
  type = 'text',
  name,
  label,
  placeholder,
  hint,
  multiple,
  className,
  fieldClassName,
  children
}) => {
  return (
    <div className={className}>
      {label ? <Label>{label}</Label> : null}
      <Field name={name}>
        {
          ({ field, form }) => (
            <Input
              type={type}
              title={label}
              placeholder={placeholder}
              {...field}
              invalid={
                getIn(form.errors, name) && getIn(form.touched, name)
              }
              multiple={multiple}
              className={fieldClassName}
            >{children}</Input>
          )
        }
      </Field>
      <ErrorMessage name={name}>
        {msg => <FormFeedback type="invalid">{msg}</FormFeedback>}
      </ErrorMessage>
      {hint ? <FormText>{hint}</FormText> : null}
    </div>
  )
}

export const DateField = ({
  name,
  label,
  hint,
  inputFieldProps,
  className,
}) => (
  <div className={className}>
    {label ? <Label>{label}</Label> : null}
    <Field name={name}>
      {
        ({ field, form }) => {
          return <ReactDatePicker
            className={`form-control ${getIn(form.errors, name) && getIn(form.touched, name) ? 'is-invalid' : ''}`}
            title={label}
            {...field}
            selected={field.value}
            onChange={(date) => form.setFieldValue(name, date)}
            {...inputFieldProps}
          />
        }
      }
    </Field>
    <ErrorMessage name={name}>
      {msg => <FormFeedback type="invalid">{msg}</FormFeedback>}
    </ErrorMessage>
    {hint ? <FormText>{hint}</FormText> : null}
  </div>
)

export const CheckboxArrayField = ({
  name,
  index,
  value,
  arrayHelpers,
  label,
  hint,
  className,
  inputClassName
}) => {
  const handleClick = (e, value, formik) => {
    const { checked } = e.target;
    if (checked) {
      arrayHelpers.remove(formik.values[name].indexOf(value))
    } else {
      arrayHelpers.push(value)
    }
  };

  return (
    <div className={className}>
      <Field name={`${name}[${index}]`} type="checkbox">
        {
          ({ field, form }) => {
            return (
              <FormGroup check>
                <Input
                  type="checkbox"
                  id={field.name}
                  name={field.name}
                  title={label}
                  value={value}
                  checked={form.values?.[name]?.includes(value)}
                  onChange={() => { }}
                  onClick={(e) => handleClick(e, value, form)}
                  invalid={
                    getIn(form.errors, field.name) && getIn(form.touched, field.name)
                  }
                  className={inputClassName}
                />
                <Label for={field.name} check>{label}</Label>
              </FormGroup>
            )
          }
        }
      </Field>
      <ErrorMessage name={`${name}[${index}]`}>
        {msg => <FormFeedback type="invalid">{msg}</FormFeedback>}
      </ErrorMessage>
      {hint ? <FormText>{hint}</FormText> : null}
    </div>
  )
}