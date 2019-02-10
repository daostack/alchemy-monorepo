import { ApolloQueryResult } from 'apollo-client'
import gql from 'graphql-tag'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { Arc } from './arc'
import { Address, Hash, IStateful, Web3Receipt } from './types'

export interface ITokenState {
  address: Address
  name: string
  owner: Address
  symbol: string
  totalSupply: number
}

export interface IApproval {
  id: Hash
  txHash: Hash
  contract: Address
  owner: Address
  spender: Address
  value: number
}

export class Token implements IStateful<ITokenState> {

  public state: Observable<ITokenState> = of()

  constructor(public address: Address, public context: Arc) {
    if (!address) {
      throw Error(`No address provided - cannot create Token instance`)
    }
    const query = gql`{
      token(id: "${address.toLowerCase()}") {
        id,
        name,
        symbol,
        totalSupply
      }
    }`

    const itemMap = (item: any): ITokenState => {
      if (item === null) {
        throw Error(`Could not find a token contract with address ${address.toLowerCase()}`)
      }
      return {
        address: item.id,
        name: item.name,
        owner: item.owner,
        symbol: item.symbol,
        totalSupply: item.totalSupply
      }
    }
    this.state = this.context._getObservableObject(query, itemMap) as Observable<ITokenState>
  }

  public balanceOf(address: string): Observable<number> {
    const query = gql`{
      tokenHolders (
        where: {
          address:"${address}",
          contract: "${this.address}"
        }
      )
      {
        id, address, balance,contract
      }
    }`
    return this.context.getObservable(query).pipe(
      map((r: ApolloQueryResult<any>) => r.data.tokenHolders),
      map((items: any[]) => {
        const item = items.length > 0 && items[0]
        if (item) {
          return Number(item.balance)
        } else {
          return Number(0)
        }
      })
    )
  }
  /*
   * get a web3 contract instance for this token
   */
  public getContract() {
    // TODO: use a generic ERC20 Abi here instead of the current quick hack
    const contract = this.context.getContract('DAOToken')
    if (contract.options.address !== this.address) {
      throw Error(`Cannot find contract address`)
    }
    return contract

  }
  public mint(beneficiary: Address, amount: number) {
    const contract = this.getContract()
    const transaction = contract.methods.mint(beneficiary, amount)
    const mapReceipt = (receipt: Web3Receipt) => receipt
    return this.context.sendTransaction(transaction, mapReceipt)
  }

  public approveForStaking(amount: number) {
    const stakingToken = this.getContract()
    // TODO: we should get the protocol address from the DAO
    const genesisProtocol = this.context.getContract('GenesisProtocol')

    const transaction = stakingToken.methods.approve(genesisProtocol.options.address, amount)

    const mapReceipt = (receipt: Web3Receipt) => {
      if (Object.keys(receipt.events).length  === 0) {
        // this does not mean that anything failed,
        return receipt
      } else {
        return receipt
      }
    }
    return this.context.sendTransaction(transaction, mapReceipt)
  }

  public approvals(address: string): Observable<any[]> {
    const query = gql`{
      tokenApprovals (
        where: {
          owner: "${address}",
          contract: "${this.address}"
        }
      )
      {
        id, contract, owner, spender, txHash, value
      }
    }`
    return this.context._getObservableList(query)
  }

  public allowances(options: { owner?: Address, spender?: Address}): Observable<any[]> {
    // the allownaces entry tracks the GEN token, so the query only makes sense if the current token is the GEN token
    if (this.address !== this.context.getContract('DAOToken').options.address) {
      throw Error(`The current Token is not the GEN token - cannot query for allowances`)
    }

    // TODO: below is a temp hack, and wil not work with the options.spender or withou the options.owner arg!
    // see for resolution below
    let whereclause = ''
    if (options.owner) {
      whereclause += `address: "${options.owner.toLowerCase()}"\n`
    }
    whereclause += `contract: "${this.address.toLowerCase()}"\n`
    if (whereclause) {
      whereclause = `(where: { ${whereclause}})`
    }
    const query = gql`{
      tokenHolders
        ${whereclause}
      {
        id
        address
        allowances {
          spender
          amount
        }
      }
    }`
    const itemMap = (r: any) => {
      if (r.allowances.length > 0) {
        return {
          amount: Number(r.allowances[0].amount),
          owner: r.address,
          spender: r.allowances[0].spender
        }
      } else {
        return {
          amount: 0,
          owner: options.owner
          // spender: r.allowances[0].spender
        }
      }
    }
    return this.context._getObservableList(query, itemMap)

    // TODO: use the code below once https://github.com/daostack/subgraph/issues/55 is resolved
    // let whereclause = ''
    // if (options.owner) {
    //   whereclause += `owner: "${options.owner.toLowerCase()}"\n`
    // }
    // if (options.spender) {
    //   whereclause += `spender: "${options.spender.toLowerCase()}"\n`
    // }
    //
    // if (whereclause) {
    //   whereclause = `(where: { ${whereclause}})`
    // }
    // const query = gql`{
    //   allowances
    //   ${whereclause}
    //   {
    //     id
    //     owner {
    //       id
    //     }
    //     spender
    //     amount
    //   }
    // }`
    // return this.context._getObservableList(query)
  }
}
