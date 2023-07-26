import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AddressEntity } from '../../address/entities/address.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('rowid')
  id?: number;

  @Column({ name: 'name', length: 63, nullable: false })
  name: string;

  @Column({
    name: 'email',
    length: 127,
    unique: true,
  })
  email: string;

  @Column({
    name: 'password',
    length: 127,
  })
  password: string;

  @Column({
    name: 'phone',
    length: 14,
  })
  phone: string;

  @Column({
    name: 'cpf',
    length: 11,
  })
  cpf: string;

  @Column({ name: 'type_user' })
  typeUser: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at?: Date;

  @OneToMany(() => AddressEntity, (address) => address.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'userId' })
  addresses?: AddressEntity[];
}
