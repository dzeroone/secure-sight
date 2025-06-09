'use strict'

import {NodeSDK} from '@opentelemetry/sdk-node'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node'

const traceExporter = new ConsoleSpanExporter()

const instrumentations = [new HttpInstrumentation(), new PinoInstrumentation()]
// const instrumentations = [new PinoInstrumentation()]

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    'service.name': 'secure-sight-api'
  }),
  // traceExporter,
  instrumentations
})

sdk.start()

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error: any) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0))
})