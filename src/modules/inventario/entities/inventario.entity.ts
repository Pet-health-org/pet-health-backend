import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Proveedor } from '../../proveedor/entities/proveedor.entity';

@Entity('inventarios')
export class Inventario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100, unique: true })
  codigo: string;

  @Column('uuid')
  proveedorId: string;

  @Column('varchar', { length: 150 })
  nombreProducto: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column('varchar', { length: 50 })
  tipo: string;

  @Column('varchar', { length: 100, nullable: true })
  presentacion: string;

  @Column('varchar', { length: 50, nullable: true })
  unidadMedida: string;

  @Column('int')
  stockActual: number;

  @Column('int')
  stockMinimo: number;

  @Column('timestamp', { nullable: true })
  fechaVencimiento: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  precioUnitario: number;

  @Column('boolean', { default: true })
  estaActivo: boolean;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Proveedor)
  @JoinColumn({ name: 'proveedorId' })
  proveedor: Proveedor;
}
