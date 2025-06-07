import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto, UpdateTodoDto, TodoQueryDto } from './dto/todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getAllTodos(@Query() query: TodoQueryDto) {
    return this.todoService.getAllTodos(query);
  }

  @Get('stats')
  async getTodoStats(@Query('companyId', ParseIntPipe) companyId: number) {
    return this.todoService.getTodoStats(companyId);
  }

  @Get(':id')
  async getTodoById(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.getTodoById(id);
  }

  @Post()
  async createTodo(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.createTodo(createTodoDto);
  }

  @Put(':id')
  async updateTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto
  ) {
    return this.todoService.updateTodo(id, updateTodoDto);
  }

  @Delete(':id')
  async deleteTodo(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.deleteTodo(id);
  }

  @Put(':id/toggle')
  async toggleTodo(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.toggleTodo(id);
  }

  @Get('categories/list')
  async getCategories(@Query('companyId', ParseIntPipe) companyId: number) {
    return this.todoService.getCategories(companyId);
  }
}
