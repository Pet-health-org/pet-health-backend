import { Cita } from '../../modules/cita/entities/cita.entity';
import { CreateCitaDto, UpdateCitaDto } from '../../modules/cita/dto/cita.dto';

export interface ICitaReader {
  findAll(): Promise<Cita[]>;
  findOne(id: string): Promise<Cita>;
  findByMascota(mascotaId: string): Promise<Cita[]>;
  findByVeterinario(veterinarioId: string): Promise<Cita[]>;
}

export interface ICitaWriter {
  create(createDto: CreateCitaDto): Promise<Cita>;
  update(id: string, updateDto: UpdateCitaDto): Promise<Cita>;
  remove(id: string): Promise<void>;
}

export interface ICitaService extends ICitaReader, ICitaWriter {}
