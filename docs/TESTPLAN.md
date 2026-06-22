# COBOL Account Management System - Test Plan

## Overview
This test plan covers all business logic and functionality of the Account Management System. It is designed to validate the system against business requirements and can be used as a reference for creating unit and integration tests in the Node.js modernized version of the application.

---

## Test Cases

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | View Balance - Initial Balance | System initialized | 1. Start application<br/>2. Select option 1 (View Balance) | Display current balance: $1,000.00 | | | Initial balance should be $1,000.00 for all new accounts |
| TC-002 | View Balance - After Credit | Account credited with $500 | 1. Start application<br/>2. Credit account with $500<br/>3. Select option 1 (View Balance) | Display current balance: $1,500.00 | | | Balance should reflect the credit transaction |
| TC-003 | View Balance - After Debit | Account debited with $300 | 1. Start application<br/>2. Debit account with $300<br/>3. Select option 1 (View Balance) | Display current balance: $700.00 | | | Balance should reflect the debit transaction |
| TC-004 | View Balance - After Multiple Transactions | Account credited $500, debited $200 | 1. Start application<br/>2. Credit account with $500<br/>3. Debit account with $200<br/>4. Select option 1 (View Balance) | Display current balance: $1,300.00 | | | Balance should correctly reflect all transactions |
| TC-005 | Credit Account - Add $500 | Starting balance: $1,000.00 | 1. Start application<br/>2. Select option 2 (Credit Account)<br/>3. Enter amount: 500 | Display "Amount credited. New balance: 1500.00" | | | Balance should increase by exactly $500.00 |
| TC-006 | Credit Account - Add $0 | Starting balance: $1,000.00 | 1. Start application<br/>2. Select option 2 (Credit Account)<br/>3. Enter amount: 0 | Display "Amount credited. New balance: 1000.00" | | | System should allow $0 credit (no-op) |
| TC-007 | Credit Account - Add Large Amount | Starting balance: $1,000.00 | 1. Start application<br/>2. Select option 2 (Credit Account)<br/>3. Enter amount: 500000 | Display "Amount credited. New balance: 501000.00" | | | System should handle large credit amounts |
| TC-008 | Credit Account - Maximum Balance | Starting balance: $900,000.00 | 1. Start application<br/>2. Select option 2 (Credit Account)<br/>3. Enter amount: 99999 | Display "Amount credited. New balance: 999999.99" | | | Balance should not exceed $999,999.99 (system maximum) |
| TC-009 | Credit Account - Exceed Maximum | Starting balance: $900,000.00 | 1. Start application<br/>2. Select option 2 (Credit Account)<br/>3. Enter amount: 100000 | System behavior when exceeding max balance | | | Edge case: Verify system behavior at maximum boundary |
| TC-010 | Debit Account - Subtract $300 | Starting balance: $1,000.00 | 1. Start application<br/>2. Select option 3 (Debit Account)<br/>3. Enter amount: 300 | Display "Amount debited. New balance: 700.00" | | | Balance should decrease by exactly $300.00 |
| TC-011 | Debit Account - Subtract Equal to Balance | Starting balance: $1,000.00 | 1. Start application<br/>2. Select option 3 (Debit Account)<br/>3. Enter amount: 1000 | Display "Amount debited. New balance: 0.00" | | | System should allow debit equal to balance (zero balance) |
| TC-012 | Debit Account - Subtract $0 | Starting balance: $1,000.00 | 1. Start application<br/>2. Select option 3 (Debit Account)<br/>3. Enter amount: 0 | Display "Amount debited. New balance: 1000.00" | | | System should allow $0 debit (no-op) |
| TC-013 | Debit Account - Insufficient Funds | Starting balance: $500.00 | 1. Start application<br/>2. Select option 3 (Debit Account)<br/>3. Enter amount: 600 | Display "Insufficient funds for this debit."<br/>Balance remains $500.00 | | | Transaction should be rejected; balance unchanged |
| TC-014 | Debit Account - Insufficient Funds - Exact Amount Over | Starting balance: $999.99 | 1. Start application<br/>2. Select option 3 (Debit Account)<br/>3. Enter amount: 1000 | Display "Insufficient funds for this debit."<br/>Balance remains $999.99 | | | Debit amount must be ≤ current balance (off by one test) |
| TC-015 | Debit Account - Prevent Negative Balance | Starting balance: $100.00 | 1. Start application<br/>2. Select option 3 (Debit Account)<br/>3. Enter amount: 150 | Display "Insufficient funds for this debit."<br/>Balance remains $100.00 | | | System must prevent negative balances |
| TC-016 | Menu Navigation - Valid Option 1 | System initialized | 1. Start application<br/>2. Select option 1<br/>3. Verify menu returns | Menu should display again after operation | | | Menu should loop correctly after option 1 |
| TC-017 | Menu Navigation - Valid Option 2 | System initialized | 1. Start application<br/>2. Select option 2<br/>3. Enter amount: 100<br/>4. Verify menu returns | Menu should display again after operation | | | Menu should loop correctly after option 2 |
| TC-018 | Menu Navigation - Valid Option 3 | System initialized | 1. Start application<br/>2. Select option 3<br/>3. Enter amount: 100<br/>4. Verify menu returns | Menu should display again after option 3 | | | Menu should loop correctly after option 3 |
| TC-019 | Menu Navigation - Exit (Option 4) | System initialized | 1. Start application<br/>2. Select option 4 | Display "Exiting the program. Goodbye!"<br/>Program terminates | | | Program should exit gracefully |
| TC-020 | Menu Navigation - Invalid Option (0) | Menu displayed | 1. Start application<br/>2. Select option 0 | Display "Invalid choice, please select 1-4."<br/>Menu should display again | | | Invalid options should be rejected |
| TC-021 | Menu Navigation - Invalid Option (5) | Menu displayed | 1. Start application<br/>2. Select option 5 | Display "Invalid choice, please select 1-4."<br/>Menu should display again | | | Invalid options should be rejected |
| TC-022 | Menu Navigation - Invalid Option (999) | Menu displayed | 1. Start application<br/>2. Select option 999 | Display "Invalid choice, please select 1-4."<br/>Menu should display again | | | Invalid options should be rejected |
| TC-023 | Balance Persistence - Credit Then View | Starting balance: $1,000.00 | 1. Start application<br/>2. Credit account with $500<br/>3. Return to menu<br/>4. View Balance | Display balance: $1,500.00 | | | Balance should persist after credit operation |
| TC-024 | Balance Persistence - Debit Then View | Starting balance: $1,500.00 | 1. Start application<br/>2. Debit account with $300<br/>3. Return to menu<br/>4. View Balance | Display balance: $1,200.00 | | | Balance should persist after debit operation |
| TC-025 | Balance Precision - Credit with Decimals | Starting balance: $1,000.00 | 1. Start application<br/>2. Credit account with $123.45<br/>3. View Balance | Display balance: $1,123.45 | | | System should handle decimal amounts correctly |
| TC-026 | Balance Precision - Debit with Decimals | Starting balance: $1,500.50 | 1. Start application<br/>2. Debit account with $250.50<br/>3. View Balance | Display balance: $1,250.00 | | | System should handle decimal precision in debit |
| TC-027 | Sequential Transactions - Credit, Debit, Credit | Starting balance: $1,000.00 | 1. Start application<br/>2. Credit: +$500 (balance: $1,500)<br/>3. Debit: -$200 (balance: $1,300)<br/>4. Credit: +$300 (balance: $1,600)<br/>5. View Balance | Display final balance: $1,600.00 | | | Multiple sequential transactions should calculate correctly |
| TC-028 | Sequential Transactions - Multiple Debits | Starting balance: $1,000.00 | 1. Start application<br/>2. Debit: -$100 (balance: $900)<br/>3. Debit: -$200 (balance: $700)<br/>4. Debit: -$150 (balance: $550)<br/>5. View Balance | Display final balance: $550.00 | | | Multiple sequential debits should accumulate correctly |
| TC-029 | Business Rule - No Negative Balance | Starting balance: $500.00 | 1. Start application<br/>2. Attempt to debit $600 | Display "Insufficient funds for this debit."<br/>Balance remains $500.00 | | | Business rule: Balance must never go negative |
| TC-030 | Business Rule - Credit Limit Validation | Starting balance: $999,000.00 | 1. Start application<br/>2. Credit: +$1,000 | Verify system behavior at boundary | | | Test system maximum balance boundary ($999,999.99) |
| TC-031 | Data Isolation - Credit Doesn't Affect View | Starting balance: $1,000.00 | 1. Start application<br/>2. Credit account with $500<br/>3. Select View Balance (option 1) without debiting | Display balance reflects credit only: $1,500.00 | | | Credit operation should only affect balance, not other functions |
| TC-032 | Data Isolation - Debit Doesn't Affect Balance Type | Starting balance: $1,000.00 | 1. Start application<br/>2. Debit: -$100<br/>3. View Balance | Display: $900.00 (not formatted differently) | | | Debit should not change data type or format |

---

## Test Execution Summary

### Test Coverage by Functionality

#### View Balance Operations (TC-001 to TC-004, TC-023, TC-024)
- Initial balance retrieval
- Balance after credit
- Balance after debit
- Multiple transactions
- **Total: 6 test cases**

#### Credit Account Operations (TC-005 to TC-009, TC-025)
- Standard credit
- Zero credit
- Large credit amount
- Maximum balance boundary
- Decimal precision
- **Total: 6 test cases**

#### Debit Account Operations (TC-010 to TC-015, TC-026)
- Standard debit
- Debit equal to balance
- Zero debit
- Insufficient funds rejection
- Boundary testing
- Negative balance prevention
- Decimal precision
- **Total: 8 test cases**

#### Menu Navigation (TC-016 to TC-022)
- Valid option handling
- Invalid option rejection
- Program exit
- **Total: 7 test cases**

#### Data Persistence (TC-023, TC-024, TC-027, TC-028, TC-029, TC-031, TC-032)
- Balance persistence across operations
- Sequential transactions
- Data integrity
- **Total: 7 test cases**

#### Business Rules (TC-029, TC-030)
- No negative balances
- Maximum balance validation
- **Total: 2 test cases**

---

## Key Business Rules to Validate

1. **Initial Balance Rule**: All accounts start with $1,000.00
2. **No Negative Balance Rule**: System must prevent any debit that would result in a negative balance
3. **Maximum Balance Rule**: Balance cannot exceed $999,999.99
4. **Balance Precision Rule**: All amounts must be stored and displayed with 2 decimal places
5. **Transaction Validation Rule**: Debit transactions must be rejected if insufficient funds exist
6. **Data Persistence Rule**: Balance must persist across multiple transactions
7. **Menu Navigation Rule**: System must continue to display menu after each operation until user selects Exit
8. **Input Validation Rule**: Invalid menu options must be rejected with error message

---

## Notes for Node.js Implementation

1. **Unit Tests**: Test individual functions (getBalance, creditAccount, debitAccount)
2. **Integration Tests**: Test complete transaction flows and menu navigation
3. **Edge Cases**: Focus on boundary conditions (maximum balance, zero balance, insufficient funds)
4. **Decimal Handling**: Use appropriate data types (Decimal or BigDecimal) for financial calculations
5. **Error Handling**: Implement proper error responses for invalid inputs
6. **Data Validation**: Validate all input amounts before processing
7. **State Management**: Ensure balance state is correctly maintained across operations
8. **Persistence**: If using a database, validate that balance updates are properly persisted

---

## Test Execution Status

| Test Category | Total Cases | Passed | Failed | Pending |
|---|---|---|---|---|
| View Balance | 6 | | | |
| Credit Account | 6 | | | |
| Debit Account | 8 | | | |
| Menu Navigation | 7 | | | |
| Data Persistence | 7 | | | |
| Business Rules | 2 | | | |
| **TOTAL** | **32** | | | |
