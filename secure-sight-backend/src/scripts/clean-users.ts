import build from "../app";
import userController from "../controllers/user.controller";

build().then(() => {
  run()
})

const run = async () => {
  try {
    await userController.removeAll()
    console.log('all user deleted')
    process.exit()
  } catch (e) {
    console.log(e)
  }
}