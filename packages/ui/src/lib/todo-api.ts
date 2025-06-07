const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface TodoTask {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  company?: {
    id: number;
    name: string;
  };
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

export interface CreateTodoData {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  category?: string;
  assignedToId?: string;
  companyId: number;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  category?: string;
  assignedToId?: string;
}

export interface TodoQueryParams {
  companyId: number;
  search?: string;
  status?: "all" | "completed" | "pending";
  priority?: "all" | "low" | "medium" | "high";
  category?: string;
  assignedToId?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "title" | "dueDate" | "priority";
  sortOrder?: "asc" | "desc";
}

export interface TodoResponse {
  data: TodoTask[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class TodoAPI {
  static async getAllTodos(params: TodoQueryParams): Promise<TodoResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/todo?${searchParams}`);
    if (!response.ok) {
      throw new Error("Failed to fetch todos");
    }
    return response.json();
  }

  static async getTodoById(id: number): Promise<TodoTask> {
    const response = await fetch(`${API_BASE_URL}/todo/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch todo");
    }
    return response.json();
  }

  static async createTodo(data: CreateTodoData): Promise<TodoTask> {
    const response = await fetch(`${API_BASE_URL}/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create todo");
    }
    return response.json();
  }

  static async updateTodo(id: number, data: UpdateTodoData): Promise<TodoTask> {
    const response = await fetch(`${API_BASE_URL}/todo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update todo");
    }
    return response.json();
  }

  static async deleteTodo(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/todo/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete todo");
    }
  }

  static async toggleTodo(id: number): Promise<TodoTask> {
    const response = await fetch(`${API_BASE_URL}/todo/${id}/toggle`, {
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error("Failed to toggle todo");
    }
    return response.json();
  }

  static async getTodoStats(companyId: number): Promise<TodoStats> {
    const response = await fetch(
      `${API_BASE_URL}/todo/stats?companyId=${companyId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch todo stats");
    }
    return response.json();
  }

  static async getCategories(companyId: number): Promise<string[]> {
    const response = await fetch(
      `${API_BASE_URL}/todo/categories/list?companyId=${companyId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return response.json();
  }
}
