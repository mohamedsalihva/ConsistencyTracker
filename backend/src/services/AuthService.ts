import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Users";

class AuthService {

  async register(name: string, email: string, password: string) {
    
    const exists = await User.findOne({ email });
    if (exists) throw new Error("User already exists");

    const hashed = await bcrypt.hash(password, 10);

    return await User.create({
      name,
      email,
      password: hashed,
    });
  }


  async login(email: string, password: string) {
    
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const expiresIn = (process.env.JWT_EXPIRES_IN ?? "7d") as jwt.SignOptions["expiresIn"];

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn }
    );

    return { user, token };
  }
}

export default new AuthService();
