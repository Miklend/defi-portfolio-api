import { formatUnits } from 'viem';
import { MulticallResult } from '@common/types/multicall-call.interface';
import { TokenDTO } from '@tokens/types/token.interface';

function parseAaveSuppliesBorrows(
  userReserves: any[],
  reserves: any[],
  chain: string
): { supply: TokenDTO[]; borrow: TokenDTO[] } {
  const supplyTokens: TokenDTO[] = [];
  const borrowTokens: TokenDTO[] = [];

  const reservesMap = new Map(
    reserves.map((r: any) => [r.underlyingAsset?.toLowerCase(), r])
  );

  for (const userReserve of userReserves) {
    const tokenAddress = userReserve.underlyingAsset?.toLowerCase();
    if (!tokenAddress) continue;

    const reserve = reservesMap.get(tokenAddress);
    if (!reserve) continue;

    const symbol = reserve.symbol;
    const decimals = Number(reserve.decimals ?? 18);
    const liquidityIndex = BigInt(reserve.liquidityIndex ?? 0);
    const scaledATokenBalance = BigInt(userReserve.scaledATokenBalance ?? 0);
    const scaledVariableDebt = BigInt(userReserve.scaledVariableDebt ?? 0);

    // Supply
    if (scaledATokenBalance > 0n && liquidityIndex > 0n) {
      const realBalance = (scaledATokenBalance * liquidityIndex) / 10n ** 27n;

      supplyTokens.push({
        token_address: tokenAddress,
        raw_amount: realBalance.toString(),
        formatted_amount: formatUnits(realBalance, decimals),
        symbol,
        decimals,
        chain,
      });
    }

    // Borrow
    if (scaledVariableDebt > 0n) {
      borrowTokens.push({
        token_address: tokenAddress,
        raw_amount: scaledVariableDebt.toString(),
        formatted_amount: formatUnits(scaledVariableDebt, decimals),
        symbol,
        decimals,
        chain,
      });
    }
  }

  return { supply: supplyTokens, borrow: borrowTokens };
}

function parseAaveRewards(userIncentives: any[], chain: string): TokenDTO[] {
  const rewardsMap: Record<
    string,
    {
      amount: bigint;
      symbol: string;
      decimals: number;
      priceFeed?: bigint;
      priceFeedDecimals?: number;
    }
  > = {};

  for (const item of userIncentives) {
    const incentiveSources = [
      item.aTokenIncentivesUserData,
      item.vTokenIncentivesUserData,
      item.sTokenIncentivesUserData,
    ];

    for (const incentive of incentiveSources) {
      if (!incentive?.userRewardsInformation) continue;

      for (const reward of incentive.userRewardsInformation) {
        const amount = BigInt(reward.userUnclaimedRewards ?? 0n);
        if (amount === 0n) continue;

        const tokenAddress = reward.rewardTokenAddress?.toLowerCase();
        if (!tokenAddress) continue;

        const decimals = Number(reward.rewardTokenDecimals ?? 18);
        const symbol = reward.rewardTokenSymbol ?? '';
        const priceFeed = reward.rewardPriceFeed
          ? BigInt(reward.rewardPriceFeed)
          : undefined;
        const priceFeedDecimals = reward.priceFeedDecimals ?? 0;

        if (!rewardsMap[tokenAddress]) {
          rewardsMap[tokenAddress] = {
            amount,
            symbol,
            decimals,
            priceFeed,
            priceFeedDecimals,
          };
        } else {
          rewardsMap[tokenAddress].amount += amount;
        }
      }
    }
  }

  return Object.entries(rewardsMap).map(([token_address, data]) => {
    const formattedAmount = Number(formatUnits(data.amount, data.decimals));
    let priceUsd = 0;
    let valueUsd = 0;

    // if (data.priceFeed !== undefined) {
    //   priceUsd = Number(data.priceFeed) / 10 ** (data.priceFeedDecimals ?? 0);
    //   valueUsd = formattedAmount * priceUsd;
    // }

    return {
      token_address,
      raw_amount: data.amount.toString(),
      formatted_amount: formattedAmount.toString(),
      symbol: data.symbol,
      decimals: data.decimals,
      chain
    };
  });
}

export async function parserAaveType(
  results: MulticallResult<any>[],
  chain: string
): Promise<Record<'supply' | 'borrow' | 'reward', TokenDTO[]>> {
  const userReservesCall = results.find(r =>
    r.callId.includes('userReservesData')
  );
  const reservesDataCall = results.find(r =>
    r.callId.includes('reservesData')
  );
  const userIncentivesCall = results.find(r =>
    r.callId.includes('userIncentives')
  );

  if (
    !userReservesCall ||
    !reservesDataCall ||
    userReservesCall.status !== 'success' ||
    reservesDataCall.status !== 'success'
  ) {
    console.warn('[Aave Parser] Missing or failed multicall responses');
    return { supply: [], borrow: [], reward: [] };
  }

  const userReserves = userReservesCall.result?.result?.[0] ?? [];
  const reserves = reservesDataCall.result?.result?.[0] ?? [];
  const { supply, borrow } = parseAaveSuppliesBorrows(userReserves, reserves, chain);

  let reward: TokenDTO[] = [];
  if (userIncentivesCall?.status === 'success') {
    const userIncentives = userIncentivesCall.result?.result ?? [];
    reward = parseAaveRewards(userIncentives, chain);
  }

  return { supply, borrow, reward };
}
