#![allow(clippy::result_large_err)]

pub mod constants;
pub mod instructions;
pub mod state;
pub mod errors;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;
pub use errors::*;

declare_id!("FqzkXZdwYjurnUKetJCAvaUw5WAqbwzU6gZEwydeEfqS");

#[program]
pub mod vesting {
    use super::*;

    pub fn create_vesting_account(ctx: Context<CreateVestingAccount>, company_name: String) -> Result<()> {
        process_create_vesting_account(ctx, company_name)
    }

    pub fn create_employee_account(
        ctx: Context<CreateEmployeeAccount>,
        start_time: i64,
        end_time: i64,
        total_amount: u64,
        cliff_time: i64,
    ) -> Result<()> {
        process_create_employee_account(ctx, start_time, end_time, total_amount, cliff_time)
    }

    pub fn claim_token(ctx: Context<ClaimToken>, company_name: String) -> Result<()> {
        process_claim_token(ctx, company_name)
    }
}
