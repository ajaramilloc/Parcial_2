import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Profesor } from '../profesor/profesor.entity';
import { Evaluacion } from '../evaluacion/evaluacion.entity';

@Entity()
export class Proyecto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  area: string;

  @Column()
  presupuesto: number;

  @Column()
  notaFinal: number;

  @Column()
  estado: number;

  @Column()
  fechaInicio: string;

  @Column()
  fechaFin: string;

  @ManyToOne(() => Estudiante, (estudiante) => estudiante.proyectos)
  lider: Estudiante;

  @ManyToOne(() => Profesor, (profesor) => profesor.proyectos)
  mentor: Profesor;

  @OneToMany(() => Evaluacion, (evaluacion) => evaluacion.proyecto)
  evaluaciones: Evaluacion[];
}
