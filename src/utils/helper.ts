export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(38)}`;
};

export const formatBalance = (balance: bigint, decimals: number): string => {
  return (Number(balance) / Math.pow(10, decimals)).toFixed(2);
};

export const isCorrectNetwork = (
  chainId: number | null,
  targetChainId: number,
): boolean => {
  return chainId === targetChainId;
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return 'An unknown error occurred';
};
