use anchor_lang::prelude::*;

declare_id!("2fJd8iYjyi3FhCWYWARMdjBmqKHX8RnjyJpM7FgkWtiw");

#[program]
pub mod wallet_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
