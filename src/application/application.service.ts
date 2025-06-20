import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { Application } from "./application.entity";
import { Job } from "src/job/job.entity";

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

  async apply(jobId: string, userId: string, filename: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const job = await this.jobRepo.findOne({ where: { id: jobId } });

    if (!user || !job) throw new NotFoundException();

    const app = this.appRepo.create({
      user,
      job,
      cvUrl: `/uploads/cv/${filename}`,
    });

    return await this.appRepo.save(app);
  }
}
