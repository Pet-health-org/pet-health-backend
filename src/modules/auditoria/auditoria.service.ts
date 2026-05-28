import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Auditoria } from './entities/auditoria.entity';
import { CreateAuditoriaDto, QueryAuditoriaDto } from './dto/auditoria.dto';

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectRepository(Auditoria)
    private readonly auditoriaRepository: Repository<Auditoria>,
  ) {}

  async log(dto: CreateAuditoriaDto): Promise<Auditoria> {
    const entry = this.auditoriaRepository.create({
      usuarioId: dto.usuarioId,
      accion: dto.accion,
      ip: dto.ip ?? null,
      registroId: dto.registroId ?? null,
    });
    return await this.auditoriaRepository.save(entry);
  }

  async findAll(query: QueryAuditoriaDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 50, 50);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.usuarioId) {
      where.usuarioId = query.usuarioId;
    }
    if (query.accion) {
      where.accion = Like(`%${query.accion}%`);
    }
    if (query.fechaInicio && query.fechaFin) {
      where.fecha = Between(
        new Date(query.fechaInicio),
        new Date(query.fechaFin),
      );
    } else if (query.fechaInicio) {
      where.fecha = Between(
        new Date(query.fechaInicio),
        new Date('9999-12-31'),
      );
    } else if (query.fechaFin) {
      where.fecha = Between(new Date('0000-01-01'), new Date(query.fechaFin));
    }

    const [data, total] = await this.auditoriaRepository.findAndCount({
      where,
      relations: ['usuario'],
      order: { fecha: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
