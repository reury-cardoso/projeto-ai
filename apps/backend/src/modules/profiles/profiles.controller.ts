import { Controller, Get, Param } from '@nestjs/common';
import { StudentProfileDto } from './dto/student-profile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':identifier')
  getProfile(
    @Param('identifier') identifier: string,
  ): Promise<StudentProfileDto> {
    return this.profilesService.getStudentProfile(identifier);
  }
}
