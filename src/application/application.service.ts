import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { Repository } from "typeorm";
import { Application } from "./application.entity";
import { Job } from "../job/job.entity";

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private appRepo: Repository<Application>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
  ) {}

  async apply(jobId: number, userId: number, filename: string) {
    
    const job = await this.jobRepo.findOne({ where: { id: jobId } });

    if (!userId || !job) throw new NotFoundException();

    const app = this.appRepo.create({
      user: { id: userId } as User,
      job,
      cvUrl: `/uploads/cv/${filename}`,
    });

    return await this.appRepo.save(app);
  }
}
