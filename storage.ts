import { users, leads, messages, type User, type InsertUser, type Lead, type InsertLead, type Message, type InsertMessage } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  updateStripeCustomerId(id: number, customerId: string): Promise<User | undefined>;
  updateUserStripeInfo(id: number, info: { customerId: string; subscriptionId: string }): Promise<User | undefined>;
  
  // Lead operations
  getLeadsByUserId(userId: number): Promise<Lead[]>;
  createLead(lead: InsertLead & { userId: number }): Promise<Lead>;
  getLeadsCount(userId: number): Promise<number>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByLeadId(leadId: number): Promise<Message[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private leads: Map<number, Lead>;
  private messages: Map<number, Message>;
  private currentUserId: number;
  private currentLeadId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
    this.messages = new Map();
    this.currentUserId = 1;
    this.currentLeadId = 1;
    this.currentMessageId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      plan: "starter",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      leadsUsed: 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateStripeCustomerId(id: number, customerId: string): Promise<User | undefined> {
    return this.updateUser(id, { stripeCustomerId: customerId });
  }

  async updateUserStripeInfo(id: number, info: { customerId: string; subscriptionId: string }): Promise<User | undefined> {
    return this.updateUser(id, { 
      stripeCustomerId: info.customerId,
      stripeSubscriptionId: info.subscriptionId 
    });
  }

  async getLeadsByUserId(userId: number): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter(
      (lead) => lead.userId === userId,
    );
  }

  async createLead(lead: InsertLead & { userId: number }): Promise<Lead> {
    const id = this.currentLeadId++;
    const newLead: Lead = { 
      ...lead, 
      id,
      phone: lead.phone || null,
      website: lead.website || null,
      industry: lead.industry || null,
      location: lead.location || null,
      description: lead.description || null,
      score: lead.score || 0,
      verified: lead.verified || false,
      createdAt: new Date(),
    };
    this.leads.set(id, newLead);
    return newLead;
  }

  async getLeadsCount(userId: number): Promise<number> {
    return Array.from(this.leads.values()).filter(
      (lead) => lead.userId === userId,
    ).length;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const newMessage: Message = { 
      ...message, 
      id,
      createdAt: new Date(),
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async getMessagesByLeadId(leadId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.leadId === leadId,
    );
  }
}

export const storage = new MemStorage();
