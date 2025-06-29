import * as anchor from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { BanksClient, Clock, ProgramTestContext, startAnchor } from 'solana-bankrun'
import { BankrunProvider } from 'anchor-bankrun'

import IDL from '../target/idl/vesting.json'
import { SYSTEM_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/native/system'
import { Vesting } from '../target/types/vesting'
import { BN, Program } from '@coral-xyz/anchor'
// @ts-ignore
import { createMint, mintTo } from 'spl-token-bankrun'
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

// @ts-ignore
describe('Vesting Smart Contract Tests', () => {
  let beneficiary: Keypair
  let vestingAccountKey: PublicKey
  let treasuryTokenAccount: PublicKey
  let employeeAccount: PublicKey
  let provider: BankrunProvider
  let program: Program<Vesting>
  let banksClient: BanksClient
  let employer: Keypair
  let mint: PublicKey
  let beneficiaryProvider: BankrunProvider
  let program2: Program<Vesting>
  let context: ProgramTestContext
  const companyName = 'Gradify'

  // @ts-ignore
  beforeAll(async () => {
    beneficiary = new anchor.web3.Keypair()

    context = await startAnchor(
      '',
      [{ name: 'vesting', programId: new PublicKey(IDL.address) }],
      [
        {
          address: beneficiary.publicKey,
          info: {
            lamports: 1_000_000_000,
            data: Buffer.alloc(0),
            owner: SYSTEM_PROGRAM_ID,
            executable: false,
          },
        },
      ],
    )

    provider = new BankrunProvider(context)

    anchor.setProvider(provider)

    program = new Program<Vesting>(IDL as Vesting, provider)

    banksClient = context.banksClient

    employer = provider.wallet.payer

    mint = await createMint(banksClient, employer, employer.publicKey, null, 2)

    // Generate a new keypair for the beneficiary
    beneficiaryProvider = new BankrunProvider(context)
    beneficiaryProvider.wallet = new NodeWallet(beneficiary)

    program2 = new Program<Vesting>(IDL as Vesting, beneficiaryProvider)

    // Derive PDAs
    ;[vestingAccountKey] = PublicKey.findProgramAddressSync([Buffer.from(companyName)], program.programId)

    ;[treasuryTokenAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('vesting_treasury'), Buffer.from(companyName)],
      program.programId,
    )

    ;[employeeAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('employee_vesting'), beneficiary.publicKey.toBuffer(), vestingAccountKey.toBuffer()],
      program.programId,
    )
    console.log({
      vestingAccountKey: vestingAccountKey.toBase58(),
      treasuryTokenAccount: treasuryTokenAccount.toBase58(),
      employeeAccount: employeeAccount.toBase58(),
      mint: mint.toBase58(),
      employer: employer.publicKey.toBase58(),
      beneficiary: beneficiary.publicKey.toBase58(),
    })
  })

  // @ts-ignore
  it('Create Vesting Account', async () => {
    const tx = await program.methods
      .createVestingAccount(companyName)
      .accounts({
        signer: employer.publicKey,
        mint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ commitment: 'confirmed' })

    console.log('Create Vesting Account Transaction Signature:', tx)

    const vestingAccount = await program.account.vestingAccount.fetch(vestingAccountKey, 'confirmed')
    console.log('Vesting Account:', vestingAccount)
  })

  // @ts-ignore
  it('fund the treasury token account', async () => {
    const amount = 10_000 * 10 ** 9
    const mintTx = await mintTo(banksClient, employer, mint, treasuryTokenAccount, employer, amount)
    console.log('Mint to Treasury Token Account Transaction Signature:', mintTx)
  })

  // @ts-ignore
  it('should create an employee vesting account', async () => {
    const tx2 = await program.methods
      .createEmployeeAccount(new BN(0), new BN(100), new BN(100), new BN(0))
      .accounts({
        beneficiary: beneficiary.publicKey,
        vestingAccount: vestingAccountKey,
      })
      .rpc({ commitment: 'confirmed', skipPreflight: true })

    console.log('Create Employee Vesting Account Transaction Signature:', tx2)
    console.log('Beneficiary Public Key:', beneficiary.publicKey.toBase58())
    console.log('Employee Account Key:', employeeAccount.toBase58())
  })

  // @ts-ignore
  it('should claim tokens', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const currentClock = await banksClient.getClock()
    context.setClock(
      new Clock(
        currentClock.slot,
        currentClock.epochStartTimestamp,
        currentClock.epoch,
        currentClock.leaderScheduleEpoch,
        1000n,
      ),
    )

    console.log('Employee account', employeeAccount.toBase58())

    const tx3 = await program2.methods
      .claimToken(companyName)
      .accounts({
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([employer])
      .rpc({ commitment: 'confirmed' })

    console.log('Claim Tokens transaction signature', tx3)
  })
})
