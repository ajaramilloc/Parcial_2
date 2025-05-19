import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from './proyecto.entity';
import { Estudiante } from '../estudiante/estudiante.entity';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(Proyecto)
    private proyectoRepo: Repository<Proyecto>,
    @InjectRepository(Estudiante)
    private estudianteRepo: Repository<Estudiante>,
  ) {}

  async crearProyecto(data: Partial<Proyecto>): Promise<Proyecto> {
    if (
      data.presupuesto === undefined ||
      data.presupuesto <= 0 ||
      data.titulo === undefined ||
      data.titulo.length <= 15
    ) {
      throw new Error(
        'Presupuesto debe ser > 0 y el título debe tener más de 15 caracteres',
      );
    }

    return this.proyectoRepo.save(data);
  }

  async avanzarProyecto(id: number) {
    const proyecto = await this.proyectoRepo.findOneBy({ id });

    if (!proyecto) {
      throw new Error('Proyecto no encontrado');
    }

    if (proyecto.estado < 4) {
      proyecto.estado += 1;
      return this.proyectoRepo.save(proyecto);
    } else {
      throw new Error('El proyecto ya está en su estado máximo');
    }
  }

  async findAllEstudiantes(id: number): Promise<Estudiante[]> {
    const proyecto = await this.proyectoRepo.find({
      where: { id },
      relations: ['lider'],
    });
    return proyecto.map((p) => p.lider);
  }
}
