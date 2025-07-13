import { Controller, Get, Query } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioDTO } from '@portfolio/dto/portfolio-item.interface';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  // GET /portfolio?wallet=0x123...
  @Get()
  async getPortfolio(@Query('wallet') wallet: string): Promise<PortfolioDTO> {
    if (!wallet) {
      throw new Error('Wallet query parameter is required');
    }
    return this.portfolioService.getFullPortfolio(wallet);
  }
}
