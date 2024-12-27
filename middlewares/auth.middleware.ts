// import { Response } from "express"
// import { verify } from "jsonwebtoken"
// import { Request } from "express"
// import { Employee } from "../database/entities/employee.entity"

// export const authenticateToken = (isProtected: boolean) => {
//   return (
//     req: Request & { currentEmployee: Employee },
//     res: Response,
//     next: Function
//   ) => {
//     if (!isProtected) return next()

//     let accessToken = req.headers.authorization

//     if (!accessToken)
//       return res.status(402).send({ message: "access token is not set" })

//     accessToken = accessToken.split(" ")[1]

//     verify(accessToken, process?.env?.JWT_KEY, (error: any, data: any) => {
//       if (error) {
//         if (error.name === "TokenExpiredError")
//           return res.status(403).send(error.name)

//         return res.status(402).send({ message: "token is dirty" })
//       }
//       req.currentEmployee = data.data
//       next()
//     })
//   }
// }
import { Response } from "express"
import { verify } from "jsonwebtoken"
import { Request } from "express"
import { User } from "../database/entities/user.entity"
export interface AuthenticatedRequest extends Request {
  currentUser: User;
}

export const authenticateToken = (isProtected: boolean) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: Function
  ) => {
    if (!isProtected) return next()

    let accessToken = req.headers.authorization

    if (!accessToken)
      return res.status(401).send({ message: "Access token is not set" })

    accessToken = accessToken.split(" ")[1]

    verify(accessToken, process?.env?.JWT_KEY, (error: any, data: any) => {
      if (error) {
        if (error.name === "TokenExpiredError")
          return res.status(403).send(error.name)

        return res.status(401).send({ message: "Invalid token" })
      }
      req.currentUser = data.data
      next()
    })
  }
}
