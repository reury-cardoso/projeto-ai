import { Injectable } from '@nestjs/common';
import { LinkedinProfileDto } from './dto/linkedin-profile.dto';
import type { LinkedinProfileProvider } from './interfaces/linkedin-profile-provider.interface';

/**
 * O LinkedIn restringe fortemente o acesso a dados de perfis de terceiros:
 * esta implementação nunca acessa o LinkedIn diretamente (sem scraping).
 * Ela serve apenas dados que o próprio aluno forneceu/autorizou
 * explicitamente. Quando essa fonte de autorização existir (formulário,
 * painel admin, etc.), ela substitui este repositório em memória sem
 * alterar o contrato de `LinkedinProfileProvider`.
 */
@Injectable()
export class LinkedinService implements LinkedinProfileProvider {
  private readonly authorizedProfiles = new Map<string, LinkedinProfileDto>();

  async getProfileByStudentId(
    studentId: string,
  ): Promise<LinkedinProfileDto | null> {
    return this.authorizedProfiles.get(studentId) ?? null;
  }
}
