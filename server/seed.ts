console.log("DATABASE_URL:", process.env.DATABASE_URL, typeof process.env.DATABASE_URL);
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { Pool } from "pg";
import {
  users,
  employees,
  claims,
  tickets,
  leaveRequests,
  performanceReviews,
} from "../shared/schema.ts";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

async function seed() {
  // Users
  // Only insert mock-user-1 if not exists
  const existingMockUser = await db.select().from(users).where(sql`id = 'mock-user-1'`);
  if (existingMockUser.length === 0) {
    await db.insert(users).values({
      id: "mock-user-1",
      email: "mock@company.com",
      firstName: "Mock",
      lastName: "User",
      role: "employee",
      profileImageUrl: "https://randomuser.me/api/portraits/men/99.jpg",
    });
  }

  // Employees
  // Only insert mock-user-1 employee if not exists
  const existingMockEmployee = await db.select().from(employees).where(sql`user_id = 'mock-user-1'`);
  if (existingMockEmployee.length === 0) {
    await db.insert(employees).values({
      userId: "mock-user-1",
      employeeId: "E004",
      department: "HR",
      position: "Intern",
      manager: "u1",
      salary: "30000.00",
      joinDate: new Date("2025-07-01"),
      status: "active",
      phoneNumber: "555-0000",
      address: "100 Test Blvd",
      emergencyContact: { name: "Test Contact", phone: "555-1111" },
    });
  }

  // Claims
  await db.insert(claims).values([
    {
      employeeId: 1,
      category: "travel",
      description: "Taxi to client meeting",
      amount: "45.00",
      claimDate: new Date("2024-06-10"),
      status: "approved",
    },
    {
      employeeId: 2,
      category: "meals",
      description: "Team lunch",
      amount: "120.00",
      claimDate: new Date("2024-06-12"),
      status: "pending",
    },
  ]);

  // Tickets
  await db.insert(tickets).values([
    {
      employeeId: 3,
      title: "Payroll issue",
      description: "Salary not credited",
      category: "payroll",
      priority: "high",
      status: "open",
    },
    {
      employeeId: 2,
      title: "Laptop not working",
      description: "Laptop won't boot",
      category: "it",
      priority: "urgent",
      status: "in_progress",
    },
  ]);

  // Leave Requests
  await db.insert(leaveRequests).values([
    {
      employeeId: 1,
      type: "vacation",
      startDate: new Date("2024-07-20"),
      endDate: new Date("2024-07-25"),
      days: 5,
      reason: "Family trip",
      status: "approved",
    },
    {
      employeeId: 3,
      type: "sick",
      startDate: new Date("2024-07-10"),
      endDate: new Date("2024-07-12"),
      days: 2,
      reason: "Flu",
      status: "pending",
    },
  ]);

  // Performance Reviews
  await db.insert(performanceReviews).values([
    {
      employeeId: 1,
      reviewerId: "u2",
      period: "2024-Q2",
      goals: { goal1: "Improve onboarding" },
      achievements: { achievement1: "Onboarded 5 new hires" },
      rating: 5,
      feedback: "Excellent leadership",
      status: "approved",
    },
    {
      employeeId: 2,
      reviewerId: "u1",
      period: "2024-Q2",
      goals: { goal1: "Reduce IT downtime" },
      achievements: { achievement1: "99% uptime" },
      rating: 4,
      feedback: "Great job",
      status: "submitted",
    },
  ]);

  console.log("Database seeded with realistic sample data.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
