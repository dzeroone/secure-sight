import pino from "pino"

// const transport = pino.transport({
//   target: 'pino-opentelemetry-transport'
// })

const logger = pino()

export default logger