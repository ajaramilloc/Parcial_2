import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesor } from './profesor.entity';
import { Evaluacion } from '../evaluacion/evaluacion.entity';

@Injectable()
export class ProfesorService {
  constructor(
    @InjectRepository(Profesor)
    private profesorRepo: Repository<Profesor>,
    @InjectRepository(Evaluacion)
    private evaluacionRepo: Repository<Evaluacion>,
  ) {}

  async crearProfesor(data: Partial<Profesor>): Promise<Profesor> {
    if (
      data.extension === undefined ||
      data.extension.toString().length !== 5
    ) {
      throw new Error('La extensión debe tener exactamente 5 dígitos');
    }
    return this.profesorRepo.save(data);
  }

  async asignarEvaluador(id: number) {
    const evaluaciones = await this.evaluacionRepo.find({
      where: { evaluador: { id } },
    });

    if (evaluaciones.length >= 3) {
      throw new Error('El profesor ya tiene 3 o más evaluaciones activas');
    }

    const profe = await this.profesorRepo.findOneBy({ id });
    if (!profe) {
      throw new Error('Profesor no encontrado');
    }

    profe.esParEvaluador = true;
    return this.profesorRepo.save(profe);
  }
}
