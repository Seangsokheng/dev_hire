import { Application } from '../application/application.entity';
import { Job } from '../job/job.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';


export enum Role {
  ADMIN = 'ADMIN',
  COMPANY = 'COMPANY',
  DEVELOPER = 'DEVELOPER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.DEVELOPER })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Job, (job) => job.company)
  jobs: Job[];

  @OneToMany(() => Application, (application) => application.user)
  applied: Application[];
}
