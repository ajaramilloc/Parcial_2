import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Estudiante } from './estudiante.entity';
import { Proyecto } from '../proyecto/proyecto.entity';

describe('EstudianteService', () => {
  let service: EstudianteService;

  const mockEstudianteRepo = {
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };

  const mockProyectoRepo = {
    find: jest.fn(),
    count: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstudianteService,
        {
          provide: getRepositoryToken(Estudiante),
          useValue: mockEstudianteRepo,
        },
        { provide: getRepositoryToken(Proyecto), useValue: mockProyectoRepo },
      ],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('crearEstudiante', () => {
    it('debería crear un estudiante si promedio > 3.2 y semestre >= 4', async () => {
      const data = { promedio: 3.5, semestre: 4, nombre: 'Juan' };
      mockEstudianteRepo.save.mockResolvedValue(data);

      const result = await service.crearEstudiante(data);

      expect(mockEstudianteRepo.save).toHaveBeenCalledWith(data);
      expect(result).toEqual(data);
    });

    it('debería lanzar error si promedio <= 3.2 o semestre < 4', async () => {
      await expect(
        service.crearEstudiante({ promedio: 3.0, semestre: 3 }),
      ).rejects.toThrow(
        'Promedio debe ser mayor a 3.2 y semestre mayor o igual a 4',
      );
    });
  });

  describe('eliminarEstudiante', () => {
    it('debería eliminar estudiante si no tiene proyectos activos', async () => {
      const deleteResult = { affected: 1 };
      mockProyectoRepo.find.mockResolvedValue([]); 
      mockEstudianteRepo.delete.mockResolvedValue(deleteResult);

      const result = await service.eliminarEstudiante(1);

      expect(mockProyectoRepo.find).toHaveBeenCalledWith({
        where: { lider: { id: 1 }, estado: 0 },
      });
      expect(mockEstudianteRepo.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(deleteResult);
    });

    it('debería lanzar error si tiene proyectos activos', async () => {
      const proyectosActivos = [{ id: 1, nombre: 'Proyecto A', estado: 0 }];
      mockProyectoRepo.find.mockResolvedValue(proyectosActivos);

      await expect(service.eliminarEstudiante(1)).rejects.toThrow(
        'Estudiante con proyectos activos no puede ser eliminado',
      );
    });
  });
});
