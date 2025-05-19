import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Estudiante } from './estudiante/estudiante.entity';
import { Profesor } from './profesor/profesor.entity';
import { Proyecto } from './proyecto/proyecto.entity';
import { Evaluacion } from './evaluacion/evaluacion.entity';

import { EstudianteService } from './estudiante/estudiante.service';
import { ProfesorService } from './profesor/profesor.service';
import { ProyectoService } from './proyecto/proyecto.service';
import { EvaluacionService } from './evaluacion/evaluacion.service';

import { EstudianteController } from './estudiante/estudiante.controller';
import { ProfesorController } from './profesor/profesor.controller';
import { ProyectoController } from './proyecto/proyecto.controller';
import { EvaluacionController } from './evaluacion/evaluacion.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Estudiante, Profesor, Proyecto, Evaluacion],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Estudiante, Profesor, Proyecto, Evaluacion]),
  ],
  controllers: [
    EstudianteController,
    ProfesorController,
    ProyectoController,
    EvaluacionController,
  ],
  providers: [
    EstudianteService,
    ProfesorService,
    ProyectoService,
    EvaluacionService,
  ],
  exports: [
    EstudianteService,
    ProfesorService,
    ProyectoService,
    EvaluacionService,
  ],
})
export class AppModule {}
