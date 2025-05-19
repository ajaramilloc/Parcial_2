import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Proyecto } from '../proyecto/proyecto.entity';

@Entity()
export class Estudiante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  semestre: number;

  @Column()
  programa: string;

  @Column()
  promedio: number;

  @OneToMany(() => Proyecto, (proyecto) => proyecto.lider)
  proyectos: Proyecto[];
}
