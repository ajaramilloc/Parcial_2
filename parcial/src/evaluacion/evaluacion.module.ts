import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evaluacion } from './evaluacion.entity';
import { EvaluacionService } from './evaluacion.service';
import { EvaluacionController } from './evaluacion.controller';
import { Proyecto } from '../proyecto/proyecto.entity';
import { Profesor } from '../profesor/profesor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Evaluacion, Proyecto, Profesor])],
  providers: [EvaluacionService],
  controllers: [EvaluacionController],
  exports: [EvaluacionService],
})
export class EvaluacionModule {}
