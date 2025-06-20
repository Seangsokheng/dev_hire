import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Application } from 'src/application/application.entity';


@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: Number;
  
  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.jobs)
  company: User;

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];

  @CreateDateColumn()
  createdAt: Date;
}
