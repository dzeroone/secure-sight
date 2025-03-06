import * as yup from 'yup'

const oneOfSchemas: Parameters<typeof yup.addMethod> = [
  yup.MixedSchema,
  'oneOfSchemas',
  function (schemas: yup.AnySchema[]) {
    return (this as yup.AnySchema).when(
      (values, schema, options) => schemas.find(one => one.isValidSync(options.value)) || schemas[0]
    )
  }
]
yup.addMethod(yup.mixed, 'oneOfSchemas', oneOfSchemas[2])

yup.addMethod(yup.string, 'ipv4', function (message = 'Invalid IP address') {
  return (this as yup.StringSchema).matches(/(^(\d{1,3}\.){3}(\d{1,3})$)/, {
    message,
    excludeEmptyString: true
  }).test('ip', message, value => {
    return value === undefined || value.trim() === ''
      ? true
      : value.split('.').find(i => parseInt(i, 10) > 255) === undefined;
  });
})

declare module 'yup' {
  interface MixedSchema {
    oneOfSchemas<T>(schemas: yup.AnySchema[]): yup.AnySchema<T>
  }
  interface StringSchema {
    ipv4(message?: string): StringSchema
  }
}

export default yup
