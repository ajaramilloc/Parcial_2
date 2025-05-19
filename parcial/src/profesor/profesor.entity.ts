import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Proyecto } from '../proyecto/proyecto.entity';
import { Evaluacion } from '../evaluacion/evaluacion.entity';

@Entity()
export class Profesor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  departamento: string;

  @Column()
  extension: number;

  @Column()
  esParEvaluador: boolean;

  @OneToMany(() => Proyecto, (proyecto) => proyecto.mentor)
  proyectos: Proyecto[];

  @OneToMany(() => Evaluacion, (evaluacion) => evaluacion.evaluador)
  evaluaciones: Evaluacion[];
}
