import { Request, Response } from "express";
import AuthService from "../services/AuthService";

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const user = await AuthService.register(name, email, password);

      res.json({ success: true, user });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const data = await AuthService.login(email, password);

      res.cookie("token", data.token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

export default new AuthController();
