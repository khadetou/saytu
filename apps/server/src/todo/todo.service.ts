import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto, UpdateTodoDto, TodoQueryDto } from './dto/todo.dto';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async getAllTodos(query: TodoQueryDto) {
    const {
      companyId,
      search,
      status,
      priority,
      category,
      assignedToId,
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    const where: any = {
      companyId: Number(companyId)
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status === 'completed') {
      where.completed = true;
    } else if (status === 'pending') {
      where.completed = false;
    }

    if (priority && priority !== 'all') {
      where.priority = priority;
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (assignedToId) {
      where.assignedToId = assignedToId;
    }

    const [todos, total] = await Promise.all([
      this.prisma.todoTask.findMany({
        where,
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      this.prisma.todoTask.count({ where })
    ]);

    return {
      data: todos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getTodoById(id: number) {
    const todo = await this.prisma.todoTask.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        company: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  async createTodo(createTodoDto: CreateTodoDto) {
    const todo = await this.prisma.todoTask.create({
      data: {
        ...createTodoDto,
        companyId: Number(createTodoDto.companyId),
        assignedToId: createTodoDto.assignedToId || null,
        dueDate: createTodoDto.dueDate ? new Date(createTodoDto.dueDate) : null
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return todo;
  }

  async updateTodo(id: number, updateTodoDto: UpdateTodoDto) {
    const existingTodo = await this.prisma.todoTask.findUnique({
      where: { id }
    });

    if (!existingTodo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    const todo = await this.prisma.todoTask.update({
      where: { id },
      data: {
        ...updateTodoDto,
        assignedToId: updateTodoDto.assignedToId || null,
        dueDate: updateTodoDto.dueDate ? new Date(updateTodoDto.dueDate) : null
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return todo;
  }

  async deleteTodo(id: number) {
    const existingTodo = await this.prisma.todoTask.findUnique({
      where: { id }
    });

    if (!existingTodo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    await this.prisma.todoTask.delete({
      where: { id }
    });

    return { message: 'Todo deleted successfully' };
  }

  async toggleTodo(id: number) {
    const existingTodo = await this.prisma.todoTask.findUnique({
      where: { id }
    });

    if (!existingTodo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    const todo = await this.prisma.todoTask.update({
      where: { id },
      data: {
        completed: !existingTodo.completed
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return todo;
  }

  async getTodoStats(companyId: number) {
    const [total, completed, pending, overdue] = await Promise.all([
      this.prisma.todoTask.count({
        where: { companyId }
      }),
      this.prisma.todoTask.count({
        where: { companyId, completed: true }
      }),
      this.prisma.todoTask.count({
        where: { companyId, completed: false }
      }),
      this.prisma.todoTask.count({
        where: {
          companyId,
          completed: false,
          dueDate: {
            lt: new Date()
          }
        }
      })
    ]);

    return {
      total,
      completed,
      pending,
      overdue
    };
  }

  async getCategories(companyId: number) {
    const categories = await this.prisma.todoTask.findMany({
      where: { companyId },
      select: { category: true },
      distinct: ['category']
    });

    return categories.map(c => c.category).filter(Boolean);
  }
}
