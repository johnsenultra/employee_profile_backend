import { Request, Response } from "express"
import { route } from "express-extract-routes"
import { FamilyInfo } from "../database/entities/family_info.entity"
import { getRepository } from "typeorm"

@route("/families")
export class FamilyInfoController {
  @route.get("/")
  async getAll(request: Request, response: Response) {
    const families = await getRepository(FamilyInfo).find()
    return families
  }

  @route.post("/")
  async store(request: Request, response: Response) {
    const family = request.body as FamilyInfo
    try {
      const savedFamily = await getRepository(FamilyInfo).save(family)
      return response
        .status(201)
        .send({ message: "created", data: savedFamily })
    } catch (error) {
      return response.status(400).send({ message: error?.message })
    }
  }

  @route.put("/:id")
  async update(request: Request, response: Response) {
    const family = request.body as FamilyInfo
    try {
      await getRepository(FamilyInfo).update(request.params?.id, family)
      return response.status(201).send({ message: "updated" })
    } catch (error) {
      return response.status(400).send({ message: error?.message })
    }
  }
}
