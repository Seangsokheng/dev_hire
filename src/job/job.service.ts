import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Job } from './job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { QueryJobDto } from './dto/query-job.dto';
import { User } from '../user/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class JobService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Job) private jobRepo: Repository<Job>,
  ) {}

  async create(createDto: CreateJobDto, user: { userId : string }) {

    const job = this.jobRepo.create({ ...createDto, company : { id: user.userId } });
    return await this.jobRepo.save(job);
  }

  async findAll(query: QueryJobDto) {
    const {
      title,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = '1',
      limit = '10',
    } = query;

    const where = title ? { title: ILike(`%${title}%`) } : {};

    const [data, total] = await this.jobRepo.findAndCount({
      where,
      relations: ['company'],
      order: { [sortBy]: sortOrder.toUpperCase() as 'ASC' | 'DESC' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    });

    return { data, total, page: +page, limit: +limit };
  }

  async findOne(id: string) {
    const job = await this.jobRepo.findOne({ where: { id }, relations: ['company'] });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async delete(id: string, user: User) {
    const job = await this.findOne(id);
    if (job.company.id !== user.id) throw new NotFoundException('Not your job');
    return await this.jobRepo.remove(job);
  }
}
