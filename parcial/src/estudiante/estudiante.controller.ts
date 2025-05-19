import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { Estudiante } from './estudiante.entity';

@Controller('estudiantes')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  crear(@Body() data: Partial<Estudiante>) {
    return this.estudianteService.crearEstudiante(data);
  }

  @Get()
  async obtenerTodos() {
    return this.estudianteService.findAll();
  }

  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.estudianteService.eliminarEstudiante(id);
  }
}
