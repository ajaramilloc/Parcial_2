import { Controller, Post, Body, Param, Patch } from '@nestjs/common';
import { ProfesorService } from './profesor.service';
import { Profesor } from './profesor.entity';

@Controller('profesores')
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) {}

  @Post()
  crear(@Body() data: Partial<Profesor>) {
    return this.profesorService.crearProfesor(data);
  }

  @Patch(':id/asignar-evaluador')
  asignarEvaluador(@Param('id') id: number) {
    return this.profesorService.asignarEvaluador(id);
  }
}
