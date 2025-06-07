import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, IsDateString, IsIn } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean = false;

  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: string = 'medium';

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  category?: string = 'General';

  @IsOptional()
  @IsString()
  assignedToId?: string;

  @IsInt()
  @Type(() => Number)
  companyId: number;
}

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  assignedToId?: string;
}

export class TodoQueryDto {
  @IsInt()
  @Type(() => Number)
  companyId: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['all', 'completed', 'pending'])
  status?: string = 'all';

  @IsOptional()
  @IsIn(['all', 'low', 'medium', 'high'])
  priority?: string = 'all';

  @IsOptional()
  @IsString()
  category?: string = 'all';

  @IsOptional()
  @IsString()
  assignedToId?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number = 50;

  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'title', 'dueDate', 'priority'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: string = 'desc';
}
