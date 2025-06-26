import build from './app'
import logger from './utils/logger'

const sleep = async (timeout = 2000) => {
  return new Promise((r) => {
    setTimeout(r, timeout)
  })
}

build().then(async () => {
  console.log('run..')
  for (let i = 0; i < 500; i++) {
    console.log(i)
    logger.info({
      msg: `testing ${i}`
    })
    await sleep()
  }
  console.log('complete...')
  process.exit()
})