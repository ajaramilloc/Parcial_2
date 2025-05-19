import { Test, TestingModule } from '@nestjs/testing';
import { ProfesorService } from './profesor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profesor } from './profesor.entity';
import { Evaluacion } from '../evaluacion/evaluacion.entity';

describe('ProfesorService', () => {
  let service: ProfesorService;
  const mockProfesorRepo = {
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockEvaluacionRepo = {
    find: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfesorService,
        { provide: getRepositoryToken(Profesor), useValue: mockProfesorRepo },
        {
          provide: getRepositoryToken(Evaluacion),
          useValue: mockEvaluacionRepo,
        },
      ],
    }).compile();

    service = module.get<ProfesorService>(ProfesorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('crearProfesor', () => {
    it('debería crear profesor si extensión tiene 5 dígitos', async () => {
      const data = { extension: 12345, nombre: 'Ana' };
      mockProfesorRepo.save.mockResolvedValue(data);
      const result = await service.crearProfesor(data);
      expect(mockProfesorRepo.save).toHaveBeenCalledWith(data);
      expect(result).toEqual(data);
    });

    it('debería lanzar error si extensión no tiene 5 dígitos', async () => {
      await expect(service.crearProfesor({ extension: 1234 })).rejects.toThrow(
        'La extensión debe tener exactamente 5 dígitos',
      );
    });
  });

  describe('asignarEvaluador', () => {
    it('debería asignar evaluador si tiene menos de 3 evaluaciones', async () => {
      mockEvaluacionRepo.find.mockResolvedValue([{}, {}]);

      mockProfesorRepo.findOneBy.mockResolvedValue({
        id: 1,
        esParEvaluador: false,
      });
      mockProfesorRepo.save.mockResolvedValue({ id: 1, esParEvaluador: true });

      const result = await service.asignarEvaluador(1);
      expect(mockProfesorRepo.save).toHaveBeenCalledWith({
        id: 1,
        esParEvaluador: true,
      });
      expect(result.esParEvaluador).toBe(true);
    });

    it('debería lanzar error si tiene 3 o más evaluaciones', async () => {
      mockEvaluacionRepo.find.mockResolvedValue([{}, {}, {}]);

      await expect(service.asignarEvaluador(1)).rejects.toThrow(
        'El profesor ya tiene 3 o más evaluaciones activas',
      );
    });
  });
});
