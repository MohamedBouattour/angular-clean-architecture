import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

/**
 * Auth Service
 * Mock authentication service - in production, use proper JWT and password hashing
 */
@Injectable()
export class AuthService {
  private users: Map<string, User> = new Map();
  private tokenToUser: Map<string, string> = new Map();

  constructor() {
    // Create a default user for testing
    this.users.set('admin@example.com', {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // In production, this would be hashed
      createdAt: new Date(),
    });
  }

  async login(credentials: { email: string; password: string }) {
    const user = this.users.get(credentials.email);

    if (!user || user.password !== credentials.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate mock token
    const token = this.generateMockToken();
    this.tokenToUser.set(token, user.id);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async signup(userData: { name: string; email: string; password: string }) {
    if (this.users.has(userData.email)) {
      throw new ConflictException('Email already registered');
    }

    const id = String(this.users.size + 1);
    const newUser: User = {
      id,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      createdAt: new Date(),
    };

    this.users.set(userData.email, newUser);

    const token = this.generateMockToken();
    this.tokenToUser.set(token, id);

    return {
      access_token: token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    };
  }

  async getCurrentUser(authHeader?: string) {
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.replace('Bearer ', '');
    const userId = this.tokenToUser.get(token);

    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = Array.from(this.users.values()).find(u => u.id === userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  private generateMockToken(): string {
    return 'mock_jwt_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
