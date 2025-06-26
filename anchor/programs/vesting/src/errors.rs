use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("Claim not available yet")]
    ClaimNotAvailableYet,

    #[msg("Invalid vesting period")]
    InvalidVestingPeriod,

    #[msg("Calculation overflow occurred")]
    CalculationOverflow,

    #[msg("Nothing to claim")]
    NothingToClaim,
}