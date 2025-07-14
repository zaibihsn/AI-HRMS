import {
  users,
  employees,
  claims,
  tickets,
  leaveRequests,
  chatMessages,
  performanceReviews,
  type User,
  type UpsertUser,
  type Employee,
  type EmployeeWithUser,
  type InsertEmployee,
  type Claim,
  type ClaimWithEmployee,
  type InsertClaim,
  type Ticket,
  type TicketWithEmployee,
  type InsertTicket,
  type LeaveRequest,
  type LeaveRequestWithEmployee,
  type InsertLeaveRequest,
  type ChatMessage,
  type InsertChatMessage,
  type PerformanceReview,
  type InsertPerformanceReview,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Employee operations
  getEmployees(limit?: number, offset?: number): Promise<EmployeeWithUser[]>;
  getEmployee(id: number): Promise<EmployeeWithUser | undefined>;
  getEmployeeByUserId(userId: string): Promise<EmployeeWithUser | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, updates: Partial<InsertEmployee>): Promise<Employee>;
  searchEmployees(query: string): Promise<EmployeeWithUser[]>;
  getEmployeeCount(): Promise<number>;

  // Claims operations
  getClaims(limit?: number, offset?: number): Promise<ClaimWithEmployee[]>;
  getClaim(id: number): Promise<ClaimWithEmployee | undefined>;
  getClaimsByEmployee(employeeId: number): Promise<Claim[]>;
  createClaim(claim: InsertClaim): Promise<Claim>;
  updateClaim(id: number, updates: Partial<InsertClaim>): Promise<Claim>;
  getClaimsStats(): Promise<{ pending: number; approved: number; rejected: number; total: number }>;

  // Tickets operations
  getTickets(limit?: number, offset?: number): Promise<TicketWithEmployee[]>;
  getTicket(id: number): Promise<TicketWithEmployee | undefined>;
  getTicketsByEmployee(employeeId: number): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: number, updates: Partial<InsertTicket>): Promise<Ticket>;
  getTicketsStats(): Promise<{ open: number; inProgress: number; resolved: number; overdue: number }>;

  // Leave requests operations
  getLeaveRequests(limit?: number, offset?: number): Promise<LeaveRequestWithEmployee[]>;
  getLeaveRequest(id: number): Promise<LeaveRequestWithEmployee | undefined>;
  getLeaveRequestsByEmployee(employeeId: number): Promise<LeaveRequest[]>;
  createLeaveRequest(leaveRequest: InsertLeaveRequest): Promise<LeaveRequest>;
  updateLeaveRequest(id: number, updates: Partial<InsertLeaveRequest>): Promise<LeaveRequest>;
  getLeaveStats(): Promise<{ pending: number; approved: number; rejected: number; total: number }>;

  // Chat operations
  getChatHistory(userId: string, limit?: number): Promise<ChatMessage[]>;
  saveChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Performance operations
  getPerformanceReviews(employeeId?: number): Promise<PerformanceReview[]>;
  createPerformanceReview(review: InsertPerformanceReview): Promise<PerformanceReview>;
  updatePerformanceReview(id: number, updates: Partial<InsertPerformanceReview>): Promise<PerformanceReview>;

  // Analytics operations
  getDashboardStats(): Promise<{
    totalEmployees: number;
    activeRecruitments: number;
    pendingReviews: number;
    pendingLeaves: number;
    costSavings: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Employee operations
  async getEmployees(limit = 50, offset = 0): Promise<EmployeeWithUser[]> {
    const result = await db
      .select()
      .from(employees)
      .leftJoin(users, eq(employees.userId, users.id))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(employees.createdAt));

    return result.map(row => ({
      ...row.employees,
      user: row.users!,
    }));
  }

  async getEmployee(id: number): Promise<EmployeeWithUser | undefined> {
    const [result] = await db
      .select()
      .from(employees)
      .leftJoin(users, eq(employees.userId, users.id))
      .where(eq(employees.id, id));

    if (!result) return undefined;

    return {
      ...result.employees,
      user: result.users!,
    };
  }

  async getEmployeeByUserId(userId: string): Promise<EmployeeWithUser | undefined> {
    const [result] = await db
      .select()
      .from(employees)
      .leftJoin(users, eq(employees.userId, users.id))
      .where(eq(employees.userId, userId));

    if (!result) return undefined;

    return {
      ...result.employees,
      user: result.users!,
    };
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const [newEmployee] = await db.insert(employees).values(employee).returning();
    return newEmployee;
  }

  async updateEmployee(id: number, updates: Partial<InsertEmployee>): Promise<Employee> {
    const [updated] = await db
      .update(employees)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(employees.id, id))
      .returning();
    return updated;
  }

  async searchEmployees(query: string): Promise<EmployeeWithUser[]> {
    const result = await db
      .select()
      .from(employees)
      .leftJoin(users, eq(employees.userId, users.id))
      .where(
        or(
          like(employees.employeeId, `%${query}%`),
          like(employees.department, `%${query}%`),
          like(employees.position, `%${query}%`),
          like(users.firstName, `%${query}%`),
          like(users.lastName, `%${query}%`),
          like(users.email, `%${query}%`)
        )
      )
      .limit(20);

    return result.map(row => ({
      ...row.employees,
      user: row.users!,
    }));
  }

  async getEmployeeCount(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(employees);
    return result.count;
  }

  // Claims operations
  async getClaims(limit = 50, offset = 0): Promise<ClaimWithEmployee[]> {
    const result = await db
      .select()
      .from(claims)
      .leftJoin(employees, eq(claims.employeeId, employees.id))
      .leftJoin(users, eq(employees.userId, users.id))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(claims.createdAt));

    return result.map(row => ({
      ...row.claims,
      employee: {
        ...row.employees!,
        user: row.users!,
      },
    }));
  }

  async getClaim(id: number): Promise<ClaimWithEmployee | undefined> {
    const [result] = await db
      .select()
      .from(claims)
      .leftJoin(employees, eq(claims.employeeId, employees.id))
      .leftJoin(users, eq(employees.userId, users.id))
      .where(eq(claims.id, id));

    if (!result) return undefined;

    return {
      ...result.claims,
      employee: {
        ...result.employees!,
        user: result.users!,
      },
    };
  }

  async getClaimsByEmployee(employeeId: number): Promise<Claim[]> {
    return await db
      .select()
      .from(claims)
      .where(eq(claims.employeeId, employeeId))
      .orderBy(desc(claims.createdAt));
  }

  async createClaim(claim: InsertClaim): Promise<Claim> {
    const [newClaim] = await db.insert(claims).values(claim).returning();
    return newClaim;
  }

  async updateClaim(id: number, updates: Partial<InsertClaim>): Promise<Claim> {
    const [updated] = await db
      .update(claims)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(claims.id, id))
      .returning();
    return updated;
  }

  async getClaimsStats(): Promise<{ pending: number; approved: number; rejected: number; total: number }> {
    const [pending] = await db.select({ count: count() }).from(claims).where(eq(claims.status, 'pending'));
    const [approved] = await db.select({ count: count() }).from(claims).where(eq(claims.status, 'approved'));
    const [rejected] = await db.select({ count: count() }).from(claims).where(eq(claims.status, 'rejected'));
    const [total] = await db.select({ count: count() }).from(claims);

    return {
      pending: pending.count,
      approved: approved.count,
      rejected: rejected.count,
      total: total.count,
    };
  }

  // Tickets operations
  async getTickets(limit = 50, offset = 0): Promise<TicketWithEmployee[]> {
    const result = await db
      .select()
      .from(tickets)
      .leftJoin(employees, eq(tickets.employeeId, employees.id))
      .leftJoin(users, eq(employees.userId, users.id))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(tickets.createdAt));

    return result.map(row => ({
      ...row.tickets,
      employee: {
        ...row.employees!,
        user: row.users!,
      },
    }));
  }

  async getTicket(id: number): Promise<TicketWithEmployee | undefined> {
    const [result] = await db
      .select()
      .from(tickets)
      .leftJoin(employees, eq(tickets.employeeId, employees.id))
      .leftJoin(users, eq(employees.userId, users.id))
      .where(eq(tickets.id, id));

    if (!result) return undefined;

    return {
      ...result.tickets,
      employee: {
        ...result.employees!,
        user: result.users!,
      },
    };
  }

  async getTicketsByEmployee(employeeId: number): Promise<Ticket[]> {
    return await db
      .select()
      .from(tickets)
      .where(eq(tickets.employeeId, employeeId))
      .orderBy(desc(tickets.createdAt));
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const [newTicket] = await db.insert(tickets).values(ticket).returning();
    return newTicket;
  }

  async updateTicket(id: number, updates: Partial<InsertTicket>): Promise<Ticket> {
    const [updated] = await db
      .update(tickets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tickets.id, id))
      .returning();
    return updated;
  }

  async getTicketsStats(): Promise<{ open: number; inProgress: number; resolved: number; overdue: number }> {
    const [open] = await db.select({ count: count() }).from(tickets).where(eq(tickets.status, 'open'));
    const [inProgress] = await db.select({ count: count() }).from(tickets).where(eq(tickets.status, 'in_progress'));
    const [resolved] = await db.select({ count: count() }).from(tickets).where(eq(tickets.status, 'resolved'));
    
    // Calculate overdue tickets (open tickets past due date)
    const [overdue] = await db
      .select({ count: count() })
      .from(tickets)
      .where(
        and(
          eq(tickets.status, 'open'),
          sql`${tickets.dueDate} < NOW()`
        )
      );

    return {
      open: open.count,
      inProgress: inProgress.count,
      resolved: resolved.count,
      overdue: overdue.count,
    };
  }

  // Leave requests operations
  async getLeaveRequests(limit = 50, offset = 0): Promise<LeaveRequestWithEmployee[]> {
    const result = await db
      .select()
      .from(leaveRequests)
      .leftJoin(employees, eq(leaveRequests.employeeId, employees.id))
      .leftJoin(users, eq(employees.userId, users.id))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(leaveRequests.createdAt));

    return result.map(row => ({
      ...row.leave_requests,
      employee: {
        ...row.employees!,
        user: row.users!,
      },
    }));
  }

  async getLeaveRequest(id: number): Promise<LeaveRequestWithEmployee | undefined> {
    const [result] = await db
      .select()
      .from(leaveRequests)
      .leftJoin(employees, eq(leaveRequests.employeeId, employees.id))
      .leftJoin(users, eq(employees.userId, users.id))
      .where(eq(leaveRequests.id, id));

    if (!result) return undefined;

    return {
      ...result.leave_requests,
      employee: {
        ...result.employees!,
        user: result.users!,
      },
    };
  }

  async getLeaveRequestsByEmployee(employeeId: number): Promise<LeaveRequest[]> {
    return await db
      .select()
      .from(leaveRequests)
      .where(eq(leaveRequests.employeeId, employeeId))
      .orderBy(desc(leaveRequests.createdAt));
  }

  async createLeaveRequest(leaveRequest: InsertLeaveRequest): Promise<LeaveRequest> {
    const [newLeaveRequest] = await db.insert(leaveRequests).values(leaveRequest).returning();
    return newLeaveRequest;
  }

  async updateLeaveRequest(id: number, updates: Partial<InsertLeaveRequest>): Promise<LeaveRequest> {
    const [updated] = await db
      .update(leaveRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leaveRequests.id, id))
      .returning();
    return updated;
  }

  async getLeaveStats(): Promise<{ pending: number; approved: number; rejected: number; total: number }> {
    const [pending] = await db.select({ count: count() }).from(leaveRequests).where(eq(leaveRequests.status, 'pending'));
    const [approved] = await db.select({ count: count() }).from(leaveRequests).where(eq(leaveRequests.status, 'approved'));
    const [rejected] = await db.select({ count: count() }).from(leaveRequests).where(eq(leaveRequests.status, 'rejected'));
    const [total] = await db.select({ count: count() }).from(leaveRequests);

    return {
      pending: pending.count,
      approved: approved.count,
      rejected: rejected.count,
      total: total.count,
    };
  }

  // Chat operations
  async getChatHistory(userId: string, limit = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(chatMessages.createdAt)
      .limit(limit);
  }

  async saveChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  // Performance operations
  async getPerformanceReviews(employeeId?: number): Promise<PerformanceReview[]> {
    const query = db.select().from(performanceReviews);
    
    if (employeeId) {
      return await query.where(eq(performanceReviews.employeeId, employeeId)).orderBy(desc(performanceReviews.createdAt));
    }
    
    return await query.orderBy(desc(performanceReviews.createdAt));
  }

  async createPerformanceReview(review: InsertPerformanceReview): Promise<PerformanceReview> {
    const [newReview] = await db.insert(performanceReviews).values(review).returning();
    return newReview;
  }

  async updatePerformanceReview(id: number, updates: Partial<InsertPerformanceReview>): Promise<PerformanceReview> {
    const [updated] = await db
      .update(performanceReviews)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(performanceReviews.id, id))
      .returning();
    return updated;
  }

  // Analytics operations
  async getDashboardStats(): Promise<{
    totalEmployees: number;
    activeRecruitments: number;
    pendingReviews: number;
    pendingLeaves: number;
    costSavings: number;
  }> {
    const [employeeCount] = await db.select({ count: count() }).from(employees);
    const [pendingReviewsCount] = await db
      .select({ count: count() })
      .from(performanceReviews)
      .where(eq(performanceReviews.status, 'draft'));
    const [pendingLeavesCount] = await db
      .select({ count: count() })
      .from(leaveRequests)
      .where(eq(leaveRequests.status, 'pending'));

    return {
      totalEmployees: employeeCount.count,
      activeRecruitments: 18, // Mock data for now
      pendingReviews: pendingReviewsCount.count,
      pendingLeaves: pendingLeavesCount.count,
      costSavings: 47000, // Mock data for now
    };
  }
}

export const storage = new DatabaseStorage();
