export const sleep = (timeout = 2000) => {
  return new Promise((r) => {
    setTimeout(r, timeout)
  })
}