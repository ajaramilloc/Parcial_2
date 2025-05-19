import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { Proyecto } from '../proyecto/proyecto.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepo: Repository<Estudiante>,
    @InjectRepository(Proyecto)
    private proyectoRepo: Repository<Proyecto>,
  ) {}

  async crearEstudiante(data: Partial<Estudiante>): Promise<Estudiante> {
    if (
      data.promedio !== undefined &&
      data.semestre !== undefined &&
      data.promedio > 3.2 &&
      data.semestre >= 4
    ) {
      return this.estudianteRepo.save(data);
    }
    throw new Error(
      'Promedio debe ser mayor a 3.2 y semestre mayor o igual a 4',
    );
  }

  async eliminarEstudiante(id: number) {
    const proyectos = await this.proyectoRepo.find({
      where: { lider: { id }, estado: 0 },
    });
    if (proyectos.length > 0)
      throw new Error(
        'Estudiante con proyectos activos no puede ser eliminado',
      );
    return this.estudianteRepo.delete(id);
  }

  async findAll(): Promise<Estudiante[]> {
    return this.estudianteRepo.find();
  }
}
