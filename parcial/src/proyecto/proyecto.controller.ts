import { Controller, Post, Patch, Param, Body, Get } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { Proyecto } from './proyecto.entity';

@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Post()
  crear(@Body() data: Partial<Proyecto>) {
    return this.proyectoService.crearProyecto(data);
  }

  @Patch(':id/avanzar')
  avanzar(@Param('id') id: number) {
    return this.proyectoService.avanzarProyecto(id);
  }

  @Get(':id/estudiantes')
  findAllEstudiantes(@Param('id') id: number) {
    return this.proyectoService.findAllEstudiantes(id);
  }
}
