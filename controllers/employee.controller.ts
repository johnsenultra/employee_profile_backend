import { Request, Response } from "express"
import { route } from "express-extract-routes"
import { getRepository, Like } from "typeorm"
import { Employee } from "../database/entities/employee.entity"

@route("/employees")
export class EmployeeController {
  @route.get("/")
  async getAll(request: Request, response: Response) {
    const employees = await getRepository(Employee).find()
    return employees
  }

  @route.get("/:id")
  async getOne(request: Request, response: Response) {
    const employee = await getRepository(Employee).findOne(request.params.id)
    return employee
  }

  @route.post("/")
  async store(request: Request, response: Response) {
    const employee = request.body as Employee
    try {
      const savedEmployee = await getRepository(Employee).save(employee)
      return response
        .status(201)
        .send({ message: "created", data: savedEmployee })
    } catch (error) {
      return response.status(400).send({ message: error?.message })
    }
  }

  @route.put("/:id")
  async update(request: Request, response: Response) {
    const employee = request.body as Employee
    try {
      await getRepository(Employee).update(request.params?.id, employee)
      return response.status(201).send({ message: "updated" })
    } catch (error) {
      return response.status(400).send({ message: error?.message })
    }
  }

  @route.delete("/:id")
  async delete(request: Request, response: Response) {
    try {
      await getRepository(Employee).delete(request.params.id)
      return response.status(200).send({ message: "deleted" })
    } catch (error) {
      return response.status(400).send({ message: error?.message })
    }
  }

  @route.post("/search")
  async search(request: Request, response: Response) {
    const keyword = request.body?.keyword as string
    const employeeRepository = getRepository(Employee)
    const employees = await employeeRepository.find({
      where: [
        { firstName: Like(`%${keyword}%`) },
        { surname: Like(`%${keyword}%`) },
      ],
    })
    return employees
  }
}
