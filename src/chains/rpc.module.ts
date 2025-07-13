import { Module } from '@nestjs/common';
import { RpcService } from '@chains/rpc.service';
import { MulticallService } from '@chains/multicall.service';

@Module({
  providers: [RpcService, MulticallService],
  exports: [RpcService, MulticallService],
})
export class RpcModule {}
