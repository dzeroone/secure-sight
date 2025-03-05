import { ErrorMessage, Field, getIn } from "formik"
import ReactDatePicker from "react-datepicker"
import { FormFeedback, FormText, Input, Label } from "reactstrap"

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
      {label ? <Label className="form-label">{label}</Label> : null}
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
    {label ? <Label className="form-label">{label}</Label> : null}
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