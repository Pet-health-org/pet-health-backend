import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum TipoVacunaEsquema {
  OBLIGATORIA = 'obligatoria',
  OPCIONAL = 'opcional',
}

@Entity('esquemas_vacunacion')
@Index('IDX_esquemas_vacunacion_especie', ['especie'])
export class EsquemaVacunacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 50 })
  especie: string;

  @Column('varchar', { length: 100 })
  nombreVacuna: string;

  @Column({
    type: 'enum',
    enum: TipoVacunaEsquema,
  })
  tipo: TipoVacunaEsquema;

  @Column('int')
  edadMinimaMeses: number;

  @Column('int', { nullable: true })
  edadMaximaMeses: number | null;

  @Column('int')
  intervaloRefuerzoDias: number;

  @Column('text', { nullable: true })
  descripcion: string | null;

  @Column('boolean', { default: true })
  estaActivo: boolean;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
