import User from "../../../database/models/user-model.js";
import jwtService from "../services/jwt-service.js";
import bcrypt from 'bcrypt';

export const signup = async (req, res) => {
  try {
    // Set nickname to email if not provided
    const nickname = req.body.nickname || req.body.email;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      email: req.body.email,
      password: hashedPassword,
      nickname,
    });

    const token = jwtService.generateAccessToken(user);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user && await bcrypt.compare(req.body.password, user.password)) {
      const token = jwtService.generateAccessToken(user);
      res.json({ token });
    } else {
      res.status(401).json({ error: "Email or password incorrect" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

