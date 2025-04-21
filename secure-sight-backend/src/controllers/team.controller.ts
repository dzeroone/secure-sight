import teamModel, { TeamDocumentType } from "../models/team.model"
import userController from "./user.controller"

class TeamController {
  async add(name: string) {
    const team = new teamModel({
      name,
      uAt: new Date()
    })
    return team.save()
  }

  async update(team: TeamDocumentType, name: string) {
    return team.update({
      $set: {
        name,
        uAt: new Date()
      }
    })
  }

  async delete(team: TeamDocumentType) {
    await userController.unassignTeam(team._id.toString())
    return team.delete()
  }

  async getById(id: string) {
    return teamModel.findById(id)
  }

  async getAll() {
    return teamModel.find().lean()
  }
}

export default new TeamController()