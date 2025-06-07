import { z } from 'zod';

// User schemas
export const UserRoleSchema = z.enum(['ADMIN', 'USER', 'CUSTOMER']);

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().nullable(),
  role: UserRoleSchema,
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
  role: UserRoleSchema.optional(),
});

// Company schemas
export const CompanySchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  website: z.string().url().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  country: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

// Product schemas
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  cost: z.number().nullable(),
  sku: z.string().nullable(),
  stock: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  categoryId: z.number().nullable(),
  companyId: z.number(),
});

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  cost: z.number().min(0, 'Cost must be positive').optional(),
  sku: z.string().optional(),
  stock: z.number().min(0, 'Stock must be positive').default(0),
  categoryId: z.number().optional(),
});

// Order schemas
export const OrderStatusSchema = z.enum(['DRAFT', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']);

export const OrderSchema = z.object({
  id: z.number(),
  orderNumber: z.string(),
  status: OrderStatusSchema,
  total: z.number(),
  notes: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  customerId: z.number(),
  companyId: z.number(),
});

// Type exports
export type User = z.infer<typeof UserSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type LoginData = z.infer<typeof LoginSchema>;
export type RegisterData = z.infer<typeof RegisterSchema>;
export type Company = z.infer<typeof CompanySchema>;
export type CreateCompanyData = z.infer<typeof CreateCompanySchema>;
export type Product = z.infer<typeof ProductSchema>;
export type CreateProductData = z.infer<typeof CreateProductSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
