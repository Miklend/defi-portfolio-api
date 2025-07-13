import { Module } from '@nestjs/common';
import { PriceService } from '@tokens/token/price-token.service';

@Module({
  providers: [PriceService],
  exports: [PriceService],
})
export class TokenModule {}
