import User from "../../database/models/user-model.js";
import jwtService from "../services/jwt-service.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      const token = jwtService.generateAccessToken(user);
      res.json({ token });
    } else {
      res.status(401).json({ error: "Email or password incorrect" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    await User.create({
      email,
      password,
    });

    const token = generateToken(user);

    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
