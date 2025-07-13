import { ProtocolAdapter } from './protocol-adapter';
import { MulticallCall } from '@common/types/multicall-call.interface';
import { TokenDTO } from '@tokens/types/token.interface';

export abstract class ApiProtocolAdapter extends ProtocolAdapter {
  // Заглушка для multicall
  async getMulticallCalls(): Promise<MulticallCall<readonly unknown[], string>[]> {
    return []; // Можно оставить пустым
  }

  // Заглушка для multicall
  async parseMulticallResults(): Promise<Record<string, TokenDTO[]>> {
    return { supply: [], borrow: [], reward: [] };
  }

  // Новый обязательный метод для API-запроса
  abstract fetchApiTokens(user: string): Promise<{
    supply?: TokenDTO[],
    borrow?: TokenDTO[],
    reward?: TokenDTO[]
  }>;

  // Переопределяем buildPortfolioFromTokens, чтобы вызывать fetchApiTokens напрямую
  async buildPortfolioFromApi(user: string): Promise<ReturnType<ProtocolAdapter['buildPortfolioFromTokens']>> {
    const { supply = [], borrow = [], reward = [] } = await this.fetchApiTokens(user);
    return super.buildPortfolioFromTokens(user, supply, borrow, reward);
  }
}
