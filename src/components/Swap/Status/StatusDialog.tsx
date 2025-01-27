import { Trans } from '@lingui/macro'
import ErrorDialog, { StatusHeader } from 'components/Error/ErrorDialog'
import EtherscanLink from 'components/EtherscanLink'
import Row from 'components/Row'
import SwapSummary from 'components/Swap/Summary'
import { LargeArrow, LargeCheck } from 'icons'
import { useMemo } from 'react'
import { Transaction, TransactionType } from 'state/transactions'
import styled from 'styled-components/macro'
import { AnimationSpeed, ThemedText } from 'theme'
import { ExplorerDataType } from 'utils/getExplorerLink'

import ActionButton from '../../ActionButton'
import Column from '../../Column'

const EtherscanLinkContainer = styled(Row)`
  padding: 0.5em 0 1.5em;
  transition: opacity ${AnimationSpeed.Medium};
  width: 100%;
  :hover {
    opacity: 0.6;
  }
`

interface TransactionStatusProps {
  tx: Transaction
  onClose: () => void
}

function TransactionStatus({ tx, onClose }: TransactionStatusProps) {
  const Icon = useMemo(() => (tx.receipt?.status ? LargeCheck : LargeArrow), [tx.receipt?.status])

  const heading = useMemo(() => {
    return tx.receipt?.status ? <Trans>Success</Trans> : <Trans>Transaction submitted</Trans>
  }, [tx.receipt?.status])

  return (
    <Column flex padded align="stretch" style={{ height: '100%', marginTop: '3em' }} data-testid="status-dialog">
      <StatusHeader icon={Icon} iconColor={tx.receipt?.status ? 'success' : undefined}>
        <ThemedText.H4 margin="3em 0 0">{heading}</ThemedText.H4>
        {tx.info.type === TransactionType.SWAP ? (
          <SwapSummary input={tx.info.trade.inputAmount} output={tx.info.trade.outputAmount} />
        ) : null}
      </StatusHeader>
      <EtherscanLinkContainer flex justify="center">
        <EtherscanLink type={ExplorerDataType.TRANSACTION} data={tx.info.response.hash} showIcon={false} color="active">
          <Trans>View on Etherscan</Trans>
        </EtherscanLink>
      </EtherscanLinkContainer>
      <ActionButton onClick={onClose}>
        <Trans>Close</Trans>
      </ActionButton>
    </Column>
  )
}

export default function TransactionStatusDialog({ tx, onClose }: TransactionStatusProps) {
  return tx.receipt?.status === 0 ? (
    <ErrorDialog
      header={<Trans>Your swap failed.</Trans>}
      message={
        <Trans>
          Try increasing your slippage tolerance.
          <br />
          NOTE: Fee on transfer and rebase tokens are incompatible with Uniswap V3.
        </Trans>
      }
      action={<Trans>Dismiss</Trans>}
      onClick={onClose}
    />
  ) : (
    <TransactionStatus tx={tx} onClose={onClose} />
  )
}
