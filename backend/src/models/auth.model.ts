import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const prisma = new PrismaClient();

export interface AuthData {
  email: string;
  password?: string;
  name?: string;
  oauthProvider?: string;
  oauthId?: string;
}

export const registerUser = async (userData: AuthData) => {
  try {
    // Sprawdź czy użytkownik już istnieje
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('Użytkownik z tym adresem email już istnieje');
    }

    // Jeśli rejestracja przez hasło, zahaszuj je
    let hashedPassword = null;
    if (userData.password) {
      hashedPassword = await bcrypt.hash(userData.password, 10);
    }

    // Utwórz nowego użytkownika
    const newUser = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        oauthProvider: userData.oauthProvider,
        oauthId: userData.oauthId
      }
    });

    // Wygeneruj token JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return { user: newUser, token };
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    // Znajdź użytkownika
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      throw new Error('Nieprawidłowy email lub hasło');
    }

    // Sprawdź hasło
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Nieprawidłowy email lub hasło');
    }

    // Wygeneruj token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return { user, token };
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { bodyMeasurements: true }
    });

    if (!user) {
      throw new Error('Użytkownik nie znaleziony');
    }

    return user;
  } catch (error) {
    throw error;
  }
};
