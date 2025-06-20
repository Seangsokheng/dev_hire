import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApplicationService } from './application.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  @Post(':jobId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DEVELOPER')
  @UseInterceptors(FileInterceptor('cv', {
    storage: diskStorage({
      destination: './uploads/cv',
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueName}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files allowed'), false);
      }
    },
  }))
  uploadCv(
    @Param('jobId') jobId: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    return this.appService.apply(jobId, req.user.userId, file.filename);
  }
}
