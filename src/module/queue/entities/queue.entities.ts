import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/sheard/module/base.entities';

@Entity({ name: 'queue' })
export class Queue extends BaseEntity {
  @Column({ name: 'queueType' })
  queueType: string;

  @Column({ name: 'queueID', default: null })
  queueID: number;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'content' })
  content: string;
}
