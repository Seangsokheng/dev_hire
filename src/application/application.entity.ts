import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column } from 'typeorm';
import { User } from '../user/user.entity';
import { Job } from '../job/job.entity';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.applied)
  user: User;

  @ManyToOne(() => Job, (job) => job.applications)
  job: Job;

  @Column()
  cvUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
