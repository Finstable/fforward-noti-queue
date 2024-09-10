import {
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    BaseEntity as BaseEntityTypeOrm,
    Column,
  } from 'typeorm';
  
  export abstract class BaseEntity extends BaseEntityTypeOrm {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt?: Date;
  
    @Column({ name: 'created_by', nullable: true })
    createdBy: string;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt?: Date;
  
    @Column({ name: 'updated_by', nullable: true })
    updatedBy: string;
  
    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
    deletedAt?: Date;
  
    @Column({ name: 'deleted_by', nullable: true })
    deletedBy: string;
  }