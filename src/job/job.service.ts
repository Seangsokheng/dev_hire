import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Job } from './job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { QueryJobDto } from './dto/query-job.dto';
import { User } from '../user/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class JobService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Job) private jobRepo: Repository<Job>,
  ) {}

  async create(createDto: CreateJobDto, user: { userId: number }) {
    const job = this.jobRepo.create({ ...createDto, company: { id: user.userId } });
    return await this.jobRepo.save(job);
  }

  async findAll(query: QueryJobDto) {
    const {
      title,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = '1',
      limit = '10',
      include,
    } = query;

    const where = title ? { title: ILike(`%${title}%`) } : {};
    const relations = include
      ? include.split(',').map((rel) => rel.trim())
      : ['company'];

    const cacheKey = `jobs:${title || 'all'}:${sortBy}:${sortOrder}:${page}:${limit}:${include || 'default'}`;

    const cached = await this.cacheManager.get(cacheKey);
    console.log('cache get result:', cached);
    if (cached) {
      console.log(`✅ Returned jobs from cache: ${cacheKey}`);
      return cached;
    }

    const [data, total] = await this.jobRepo.findAndCount({
      where,
      relations,
      order: { [sortBy]: sortOrder.toUpperCase() as 'ASC' | 'DESC' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    });

    const result = { data, total, page: +page, limit: +limit };
    await this.cacheManager.set(cacheKey, result, 60); // cache for 60 seconds

    return result;
  }

  async findOne(id: number) {
    const job = await this.jobRepo.findOne({ where: { id }, relations: ['company'] });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async delete(id: number, user: User) {
    const job = await this.findOne(id);
    if (job.company.id !== user.id) throw new NotFoundException('Not your job');
    return await this.jobRepo.remove(job);
  }
}
