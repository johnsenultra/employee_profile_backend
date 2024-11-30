import { Request, Response } from "express";
import { route } from "express-extract-routes";
import { getRepository } from "typeorm";
import { EducationBackground } from "../database/entities/education_background.entity";

// protected routes means need/valid token to access the apis
@route("/educations-background", { protected: true })
export class EducationBackgroundController {
   @route.get("/") // get all educations background
   async getAll(request: Request, response: Response) {
      const educationsBackground = await getRepository(EducationBackground).find();
      return educationsBackground;
   }

   @route.get("/:id") // get education background by id
   async getOne(request: Request, response: Response) {
      const educationBackground = await getRepository(EducationBackground).findOne(request.params.id);
      return educationBackground;
   }

   @route.post("/") // store education background
   async store(request: Request, response: Response) {
      const educationBackground = request.body as EducationBackground;
      try {
         const savedEducationBackground = await getRepository(EducationBackground).save(educationBackground);
         return response.status(201).send({ message: "created", data: savedEducationBackground });
      } catch (error) {
         return response.status(400).send({ message: error?.message }); 
      }
   }

   @route.put("/:id") // update education background by id
   async update(request: Request, response: Response) {
      const educationBackground = request.body as EducationBackground;
      try {
         await getRepository(EducationBackground).update(request.params?.id, educationBackground);
         return response.status(200).send({ message: "update" });
      } catch (error) {
         return response.status(400).send({ message: error?.message });
      }
   }
}
