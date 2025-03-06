import * as yup from 'yup'

function ipv4(message = 'Invalid IP address') {
  return this.matches(/(^(\d{1,3}\.){3}(\d{1,3})$)/, {
    message,
    excludeEmptyString: true
  }).test('ip', message, value => {
    return value === undefined || value.trim() === ''
      ? true
      : value.split('.').find(i => parseInt(i, 10) > 255) === undefined;
  });
}

function oneOfSchemas(schemas) {
  return this.when(
    (values, schema, options) => schemas.find(one => one.isValidSync(options.value)) || schemas[0]
  );
}

yup.addMethod(yup.string, 'ipv4', ipv4);
yup.addMethod(yup.mixed, "oneOfSchemas", oneOfSchemas)

export default yup