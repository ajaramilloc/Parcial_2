import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyecto } from './proyecto.entity';
import { ProyectoService } from './proyecto.service';
import { ProyectoController } from './proyecto.controller';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Profesor } from '../profesor/profesor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto, Estudiante, Profesor])],
  providers: [ProyectoService],
  controllers: [ProyectoController],
  exports: [ProyectoService],
})
export class ProyectoModule {}
