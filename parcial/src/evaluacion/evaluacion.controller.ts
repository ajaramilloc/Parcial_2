import { Controller, Post, Body } from '@nestjs/common';
import { EvaluacionService } from './evaluacion.service';
import { Evaluacion } from './evaluacion.entity';

@Controller('evaluaciones')
export class EvaluacionController {
  constructor(private readonly evaluacionService: EvaluacionService) {}

  @Post()
  crear(@Body() data: Partial<Evaluacion>) {
    return this.evaluacionService.crearEvaluacion(data);
  }
}
