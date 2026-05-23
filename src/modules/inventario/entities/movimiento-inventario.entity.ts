import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Inventario } from './inventario.entity';
import { Consulta } from '../../consulta/entities/consulta.entity';

export enum TipoMovimientoInventario {
  USO_CONSULTA = 'uso_consulta',
}

@Entity('movimientos_inventario')
export class MovimientoInventario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  inventarioId: string;

  @Column('uuid')
  consultaId: string;

  @Column('int')
  cantidad: number;

  @Column({
    type: 'enum',
    enum: TipoMovimientoInventario,
  })
  tipoMovimiento: TipoMovimientoInventario;

  @Column('int')
  stockAnterior: number;

  @Column('int')
  stockResultante: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  fechaMovimiento: Date;

  @ManyToOne(() => Inventario)
  @JoinColumn({ name: 'inventarioId' })
  inventario: Inventario;

  @ManyToOne(() => Consulta)
  @JoinColumn({ name: 'consultaId' })
  consulta: Consulta;
}
