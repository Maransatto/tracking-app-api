import { Injectable } from '@nestjs/common';
import { Client } from './entities/client';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  clients: Client[] = [];

  constructor() {
    this.clients = [
      new Client(
        1,
        'Fernando Maransatto',
        '44 99930 2089',
        'Av XV de Novembro, 89',
      ),
      new Client(2, 'Maria Oliveira', '44 99876 5432', 'Rua das Flores, 123'),
      new Client(3, 'João Souza', '44 99765 4321', 'Av Brasil, 456'),
      new Client(4, 'Ana Pereira', '44 99654 3210', 'Rua das Palmeiras, 789'),
    ];
  }

  findAll() {
    return this.clients;
  }

  findOne(id: number) {
    return this.clients.find((c) => c.id === id);
  }

  create(createClientDto: CreateClientDto) {
    this.clients.push({ id: this.clients.length + 1, ...createClientDto });
    return this.clients;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    this.clients = this.clients.map((c) =>
      c.id === id ? ({ ...c, ...updateClientDto } as Client) : c,
    );
    return this.clients;
  }

  remove(id: number) {
    this.clients = this.clients.filter((c) => c.id !== id);
    return this.clients;
  }
}
