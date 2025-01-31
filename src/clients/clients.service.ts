import { Injectable, NotFoundException } from '@nestjs/common';
import { Client } from './entities/client';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return await this.clientRepository.find({ skip: offset, take: limit });
  }

  async findOne(id: number) {
    return await this.clientRepository.findOne({ where: { id } });
  }

  create(createClientDto: CreateClientDto) {
    const client = this.clientRepository.create(createClientDto);
    return this.clientRepository.save(client);
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const client = await this.clientRepository.preload({
      id,
      ...updateClientDto,
    });

    if (!client) {
      throw new NotFoundException(`Client #${id} not found`);
    }

    return this.clientRepository.save(client);
  }

  async remove(id: number) {
    const client = await this.findOne(id);
    return this.clientRepository.remove(client);
  }
}
