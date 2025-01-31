import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  // for mocking test only (temporary)
  constructor(id: number, name: string, phone: string, address: string) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.address = address;
  }
}
