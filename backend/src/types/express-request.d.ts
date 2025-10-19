import type { User } from "../services/user.store";
import "express";

declare module "express-serve-static-core" {
    interface Request {
        user?: User;
    }
}
