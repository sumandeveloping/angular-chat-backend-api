import { MutableBase } from 'src/Entity/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends MutableBase {
  @PrimaryGeneratedColumn()
  id: string;
  @Column('varchar', { length: 200 })
  username: string;
  @Column('varchar', { unique: true })
  email: string;
  @Column({ select: false })
  password: string;
}
