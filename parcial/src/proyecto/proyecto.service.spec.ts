import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProyectoService } from './proyecto.service';
import { Proyecto } from './proyecto.entity';
import { Estudiante } from '../estudiante/estudiante.entity';

describe('ProyectoService', () => {
  let service: ProyectoService;

  const mockProyectoRepo = {
    save: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
  };

  const mockEstudianteRepo = {
    // Agrega mocks aquí si necesitas para métodos usados del repositorio de Estudiante
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProyectoService,
        { provide: getRepositoryToken(Proyecto), useValue: mockProyectoRepo },
        {
          provide: getRepositoryToken(Estudiante),
          useValue: mockEstudianteRepo,
        },
      ],
    }).compile();

    service = module.get<ProyectoService>(ProyectoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('crearProyecto', () => {
    it('debería crear proyecto con presupuesto > 0 y título > 15', async () => {
      const data = {
        presupuesto: 1000,
        titulo: 'Proyecto con título largo suficiente',
      };
      mockProyectoRepo.save.mockResolvedValue({ id: 1, ...data });

      const result = await service.crearProyecto(data);

      expect(mockProyectoRepo.save).toHaveBeenCalledWith(data);
      expect(result).toHaveProperty('id');
    });

    it('debería lanzar error si presupuesto <= 0', async () => {
      const data = {
        presupuesto: 0,
        titulo: 'Proyecto con título largo suficiente',
      };

      await expect(service.crearProyecto(data)).rejects.toThrow(
        'Presupuesto debe ser > 0 y el título debe tener más de 15 caracteres',
      );
    });

    it('debería lanzar error si título <= 15 caracteres', async () => {
      const data = { presupuesto: 1000, titulo: 'Corto' };

      await expect(service.crearProyecto(data)).rejects.toThrow(
        'Presupuesto debe ser > 0 y el título debe tener más de 15 caracteres',
      );
    });
  });

  describe('avanzarProyecto', () => {
    it('debería avanzar el estado del proyecto si estado < 4', async () => {
      const proyecto = { id: 1, estado: 2 };
      mockProyectoRepo.findOneBy.mockResolvedValue(proyecto);
      mockProyectoRepo.save.mockImplementation((p) => Promise.resolve(p));

      const result = await service.avanzarProyecto(1);

      expect(mockProyectoRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockProyectoRepo.save).toHaveBeenCalled();
      expect(result.estado).toBe(3);
    });

    it('debería lanzar error si proyecto no existe', async () => {
      mockProyectoRepo.findOneBy.mockResolvedValue(null);

      await expect(service.avanzarProyecto(99)).rejects.toThrow(
        'Proyecto no encontrado',
      );
    });

    it('debería lanzar error si proyecto ya está en estado máximo', async () => {
      const proyecto = { id: 1, estado: 4 };
      mockProyectoRepo.findOneBy.mockResolvedValue(proyecto);

      await expect(service.avanzarProyecto(1)).rejects.toThrow(
        'El proyecto ya está en su estado máximo',
      );
    });
  });

  describe('findAllEstudiantes', () => {
    it('debería devolver los líderes del proyecto', async () => {
      const lider = {
        id: 1,
        nombre: 'Líder Uno',
        semestre: 6,
        programa: 'Ingeniería',
        promedio: 4.5,
        proyectos: [],
      };

      mockProyectoRepo.find.mockResolvedValue([{ id: 1, lider }]);

      const result = await service.findAllEstudiantes(1);

      expect(mockProyectoRepo.find).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['lider'],
      });
      expect(result).toEqual([lider]);
    });

    it('debería devolver array vacío si no hay proyectos', async () => {
      mockProyectoRepo.find.mockResolvedValue([]);

      const result = await service.findAllEstudiantes(999);

      expect(result).toEqual([]);
    });
  });
});
