import { ConflictException } from '@nestjs/common';
import { InventarioService } from './inventario.service';

describe('InventarioService', () => {
  const createRepository = () => ({
    findOne: jest.fn(),
    create: jest.fn((dto) => dto),
    save: jest.fn(async (entity) => ({ id: 'inventario-1', ...entity })),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
    remove: jest.fn(),
  });

  it('creates inventory products with HU-F11 fields', async () => {
    const repository = createRepository();
    repository.findOne.mockResolvedValue(null);
    const service = new InventarioService(repository as any);

    const dto = {
      codigo: 'VAC-001',
      proveedorId: '550e8400-e29b-41d4-a716-446655440001',
      nombreProducto: 'Vacuna rabia',
      descripcion: 'Vacuna anual',
      tipo: 'vacuna',
      presentacion: 'Frasco 10 dosis',
      unidadMedida: 'unidades',
      stockActual: 10,
      stockMinimo: 3,
      fechaVencimiento: '2027-01-01T00:00:00Z',
      precioUnitario: 25000,
    };

    await expect(service.create(dto)).resolves.toMatchObject(dto);
    expect(repository.create).toHaveBeenCalledWith(dto);
  });

  it('rejects duplicate inventory codes', async () => {
    const repository = createRepository();
    repository.findOne.mockResolvedValue({ id: 'existing' });
    const service = new InventarioService(repository as any);

    await expect(
      service.create({
        codigo: 'VAC-001',
        proveedorId: '550e8400-e29b-41d4-a716-446655440001',
        nombreProducto: 'Vacuna rabia',
        tipo: 'vacuna',
        stockActual: 10,
        stockMinimo: 3,
        precioUnitario: 25000,
      } as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
