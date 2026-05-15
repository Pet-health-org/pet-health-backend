import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 150 })
  nombreEmpresa: string;

  @Column('varchar', { length: 100 })
  contacto: string;

  @Column('varchar', { length: 20 })
  telefono: string;

  @Column('varchar', { length: 150 })
  correo: string;

  @Column('varchar', { length: 255 })
  direccion: string;

  @Column('varchar', { length: 100 })
  condicionesPago: string;

  @Column('boolean', { default: true })
  estaActivo: boolean;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}