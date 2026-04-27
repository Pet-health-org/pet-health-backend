import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { HistoriaClinica } from '../../historia-clinica/entities/historia-clinica.entity';
import { Inventario } from '../../inventario/entities/inventario.entity';

@Entity('medicamentos')
export class Medicamento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  historiaClinicaId: string;

  @Column('uuid')
  inventarioId: string;

  @Column('varchar', { length: 100 })
  nombre: string;

  @Column('varchar', { length: 50 })
  viaAdministracion: string;

  @Column('varchar', { length: 50, nullable: true })
  dosis: string;

  @ManyToOne(() => HistoriaClinica)
  @JoinColumn({ name: 'historiaClinicaId' })
  historiaClinica: HistoriaClinica;

  @ManyToOne(() => Inventario)
  @JoinColumn({ name: 'inventarioId' })
  inventario: Inventario;
}