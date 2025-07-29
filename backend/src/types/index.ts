import { ObjectId } from 'mongoose'

export interface User {
  _id: ObjectId
  email: string
  password: string
  role: 'admin' | 'customer'
  firstName?: string
  lastName?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Template {
  _id: ObjectId
  sellerId: ObjectId
  title: string
  description: string
  price: number
  category: string
  fileUrl: string
  previewImage?: string
  tags: string[]
  isActive: boolean
  downloads: number
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  _id: ObjectId
  customerId: ObjectId
  templateId: ObjectId
  amount: number
  stripePaymentId: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: Date
  updatedAt: Date
}

export interface AuthRequest {
  user: {
    id: string
    email: string
    role: string
  }
}

export interface CreateUserRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
  role: 'admin' | 'seller' | 'customer'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface CreateTemplateRequest {
  title: string
  description: string
  price: number
  category: string
  tags?: string[]
}

export interface UpdateTemplateRequest {
  title?: string
  description?: string
  price?: number
  category?: string
  tags?: string[]
  isActive?: boolean
} 