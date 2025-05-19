import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluacion } from './evaluacion.entity';
import { Proyecto } from '../proyecto/proyecto.entity';

@Injectable()
export class EvaluacionService {
  constructor(
    @InjectRepository(Evaluacion)
    private evaluacionRepo: Repository<Evaluacion>,
    @InjectRepository(Proyecto)
    private proyectoRepo: Repository<Proyecto>,
  ) {}

  async crearEvaluacion(data: Partial<Evaluacion>): Promise<Evaluacion> {
    if (!data.proyecto || !data.evaluador) {
      throw new Error('Debes especificar un proyecto y un evaluador');
    }

    const proyecto = await this.proyectoRepo.findOne({
      where: { id: data.proyecto.id },
      relations: ['mentor'],
    });

    if (!proyecto) {
      throw new Error('Proyecto no encontrado');
    }

    if (proyecto.mentor.id === data.evaluador.id) {
      throw new Error('El evaluador no puede ser el mentor del proyecto');
    }

    return this.evaluacionRepo.save(data);
  }
}
