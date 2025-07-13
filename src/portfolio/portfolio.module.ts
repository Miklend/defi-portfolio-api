import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { RpcModule } from '@chains/rpc.module';
import { MulticallService } from '@chains/multicall.service';
import * as Adapters from '@adapters/index';
import { TokenModule } from '@tokens/tokens.module';
import { PriceService } from '@tokens/token/price-token.service';


export const APP_ADAPTERS = 'APP_ADAPTERS';

const adapters = Object.values(Adapters);

@Module({
  imports: [RpcModule, TokenModule],
  controllers: [PortfolioController],
  providers: [
    ...adapters,
    {
      provide: APP_ADAPTERS,
      useFactory: (...injectedAdapters: any[]) => injectedAdapters,
      inject: adapters,
    },
    {
      provide: PortfolioService,
      useFactory: (adapters: any[], multicallService: MulticallService,priceService: PriceService) =>
        new PortfolioService(adapters, multicallService, priceService),
      inject: [APP_ADAPTERS, MulticallService, PriceService],
    },
  ],
  exports: [PortfolioService],
})
export class PortfolioModule {}



// import { AdapterZerolandEthereum } from '@adapters/zerolend/ethereum';

// export const APP_ADAPTERS = 'APP_ADAPTERS';

// // Создание 50 уникальных адаптеров
// const duplicatedAdapters = Array.from({ length: 100 }, (_, i) => {
//   class CustomZerolandAdapter extends AdapterZerolandEthereum {
//     adapterName = `zerolend-eth-${i}`;
//     serviceName = `Zeroland Ethereum ${i}`;
//   }

//   return {
//     provide: `ZEROLEND_ETH_ADAPTER_${i}`,
//     useClass: CustomZerolandAdapter,
//   };
// });

// // DI конфигурация
// const adapterProviderTokens = duplicatedAdapters.map(p => p.provide);

// @Module({
//   imports: [RpcModule, TokenModule],
//   controllers: [PortfolioController],
//   providers: [
//     ...duplicatedAdapters,
//     MulticallService,
//     {
//       provide: APP_ADAPTERS,
//       useFactory: (...adapters: AdapterZerolandEthereum[]) => adapters,
//       inject: adapterProviderTokens,
//     },
//     {
//       provide: PortfolioService,
//       useFactory: (adapters: any[], multicallService: MulticallService, priceService: PriceService) =>
//         new PortfolioService(adapters, multicallService, priceService),
//       inject: [APP_ADAPTERS, MulticallService, PriceService],
//     },
//   ],
//   exports: [PortfolioService],
// })
// export class PortfolioModule {}
