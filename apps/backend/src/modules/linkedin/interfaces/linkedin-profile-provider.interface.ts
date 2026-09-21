import { LinkedinProfileDto } from '../dto/linkedin-profile.dto';

export interface LinkedinProfileProvider {
  getProfileByStudentId(studentId: string): Promise<LinkedinProfileDto | null>;
}
