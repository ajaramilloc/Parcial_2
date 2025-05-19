import { Test, TestingModule } from '@nestjs/testing';
import { EvaluacionService } from './evaluacion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Evaluacion } from './evaluacion.entity';
import { Proyecto } from '../proyecto/proyecto.entity';

describe('EvaluacionService', () => {
  let service: EvaluacionService;
  const mockEvaluacionRepo = {
    save: jest.fn(),
  };
  const mockProyectoRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluacionService,
        {
          provide: getRepositoryToken(Evaluacion),
          useValue: mockEvaluacionRepo,
        },
        { provide: getRepositoryToken(Proyecto), useValue: mockProyectoRepo },
      ],
    }).compile();

    service = module.get<EvaluacionService>(EvaluacionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('crearEvaluacion', () => {
    it('debería crear evaluación si evaluador != mentor y calificación válida', async () => {
      const data = {
        proyecto: {
          id: 1,
          titulo: 'Proyecto de prueba muy largo',
          area: 'Área 1',
          presupuesto: 1000,
          notaFinal: 4,
          estado: 1,
          fechaInicio: '2024-01-01',
          fechaFin: '2024-06-01',
          lider: {
            id: 1,
            cedula: 123456,
            nombre: 'Estudiante Lider',
            semestre: 5,
            programa: 'Ingeniería',
            promedio: 4,
            proyectos: [],
          },
          mentor: {
            id: 2,
            cedula: 654321,
            nombre: 'Profesor Mentor',
            departamento: 'Departamento X',
            extension: 12345,
            esParEvaluador: false,
            proyectos: [],
            evaluacionests: [],
            evaluaciones: [],
          },
          evaluaciones: [],
        },
        evaluador: {
          id: 3,
          cedula: 112233,
          nombre: 'Profesor Evaluador',
          departamento: 'Departamento Y',
          extension: 54321,
          esParEvaluador: true,
          proyectos: [],
          evaluacionests: [],
          evaluaciones: [],
        },
        calificacion: 4,
      };

      mockProyectoRepo.findOne.mockResolvedValue({
        id: 1,
        mentor: { id: 2 },
      });
      mockEvaluacionRepo.save.mockResolvedValue(data);

      const result = await service.crearEvaluacion(data);
      expect(result).toEqual(data);
    });

    it('debería lanzar error si evaluador es mentor', async () => {
      const data = {
        proyecto: {
          id: 1,
          titulo: 'Proyecto de prueba para test',
          area: 'Ciencias de la Computación',
          presupuesto: 10000,
          notaFinal: 4.5,
          estado: 2,
          fechaInicio: '2024-01-01',
          fechaFin: '2024-12-31',
          lider: {
            id: 10,
            cedula: 12345678,
            nombre: 'Estudiante Lider',
            semestre: 6,
            programa: 'Ingeniería de Sistemas',
            promedio: 4.0,
            proyectos: [],
          },
          mentor: {
            id: 1,
            cedula: 87654321,
            nombre: 'Profesor Mentor',
            departamento: 'Departamento de Sistemas',
            extension: 12345,
            esParEvaluador: false,
            proyectos: [],
            evaluacionests: [],
            evaluaciones: [],
          },
          evaluaciones: [],
        },
        evaluador: {
          id: 1,
          cedula: 87654321,
          nombre: 'Profesor Mentor',
          departamento: 'Departamento de Sistemas',
          extension: 12345,
          esParEvaluador: false,
          proyectos: [],
          evaluacionests: [],
          evaluaciones: [],
        },
        calificacion: 3,
      };

      mockProyectoRepo.findOne.mockResolvedValue({
        id: 1,
        mentor: { id: 1 },
      });

      await expect(service.crearEvaluacion(data)).rejects.toThrow(
        'El evaluador no puede ser el mentor del proyecto',
      );
    });
  });
});
