import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Proyecto } from '../proyecto/proyecto.entity';
import { Profesor } from '../profesor/profesor.entity';

@Entity()
export class Evaluacion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.evaluaciones)
  proyecto: Proyecto;

  @ManyToOne(() => Profesor, (profesor) => profesor.evaluaciones)
  evaluador: Profesor;
}
