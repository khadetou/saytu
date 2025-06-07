import { Controller, Get, Post, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { InstallModuleDto, UninstallModuleDto } from './dto/module.dto';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get()
  async getAllModules() {
    return this.modulesService.getAllModules();
  }

  @Get('installed')
  async getInstalledModules() {
    return this.modulesService.getInstalledModules();
  }

  @Get('available')
  async getAvailableModules() {
    return this.modulesService.getAvailableModules();
  }

  @Post('install')
  async installModule(@Body() installModuleDto: InstallModuleDto) {
    try {
      const result = await this.modulesService.installModule(installModuleDto.moduleId);
      return {
        success: true,
        message: `Module ${installModuleDto.moduleId} installed successfully`,
        data: result
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to install module',
          error: error.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete('uninstall/:moduleId')
  async uninstallModule(@Param('moduleId') moduleId: string) {
    try {
      const result = await this.modulesService.uninstallModule(moduleId);
      return {
        success: true,
        message: `Module ${moduleId} uninstalled successfully`,
        data: result
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to uninstall module',
          error: error.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get(':moduleId')
  async getModuleInfo(@Param('moduleId') moduleId: string) {
    try {
      return this.modulesService.getModuleInfo(moduleId);
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `Module ${moduleId} not found`,
          error: error.message
        },
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Get(':moduleId/dependencies')
  async getModuleDependencies(@Param('moduleId') moduleId: string) {
    return this.modulesService.getModuleDependencies(moduleId);
  }
}
