/**
 * Account Management System
 * Converted from COBOL to Node.js
 * 
 * This application implements the business logic from the original COBOL system:
 * - main.cob: Menu interface and program flow
 * - data.cob: Balance persistence layer
 * - operations.cob: Core transaction operations
 */

function formatBalance(balance) {
  return Number(balance).toFixed(2).padStart(9, '0');
}

/**
 * ===========================
 * DATA LAYER (from data.cob)
 * ===========================
 * Manages persistent storage of account balance
 */
class DataLayer {
  constructor() {
    // STORAGE-BALANCE: PIC 9(6)V99 VALUE 1000.00
    this.storageBalance = 1000.00;
  }

  /**
   * READ operation - Retrieve current balance
   * Equivalent to COBOL: IF OPERATION-TYPE = 'READ'
   * @returns {number} Current balance
   */
  read() {
    return this.storageBalance;
  }

  /**
   * WRITE operation - Update balance in storage
   * Equivalent to COBOL: IF OPERATION-TYPE = 'WRITE'
   * @param {number} balance - New balance to store
   */
  write(balance) {
    this.storageBalance = balance;
  }

  /**
   * Get current balance with proper formatting
   * @returns {string} Formatted balance (PIC 9(6)V99)
   */
  getFormattedBalance() {
    return formatBalance(this.storageBalance);
  }
}

/**
 * ===========================
 * OPERATIONS LAYER (from operations.cob)
 * ===========================
 * Handles account operations: VIEW, CREDIT, DEBIT
 */
class Operations {
  constructor(dataLayer, promptFn, logFn) {
    this.data = dataLayer;
    this.promptFn = promptFn;
    this.logFn = logFn || console.log;
  }

  /**
   * View Balance Operation
   * Equivalent to COBOL: IF OPERATION-TYPE = 'TOTAL'
   */
  viewBalance() {
    const balance = this.data.read();
    const formattedBalance = formatBalance(balance);
    this.logFn(`Current balance: ${formattedBalance}`);
  }

  /**
   * Credit Account Operation
   * Equivalent to COBOL: IF OPERATION-TYPE = 'CREDIT'
   * - Prompts user for credit amount
   * - Retrieves current balance from data layer
   * - Adds credit amount to balance
   * - Updates balance in data layer
   * - Displays confirmation with new balance
   */
  creditAccount() {
    const amountStr = String(this.promptFn('Enter credit amount: ') || '').trim();
    const amount = parseFloat(amountStr);

    // Validate input
    if (isNaN(amount) || amount < 0) {
      this.logFn('Invalid amount entered.');
      return;
    }

    // CALL 'DataProgram' USING 'READ'
    let finalBalance = this.data.read();

    // ADD AMOUNT TO FINAL-BALANCE
    finalBalance += amount;

    // CALL 'DataProgram' USING 'WRITE'
    this.data.write(finalBalance);

    // DISPLAY confirmation message
    const formattedBalance = formatBalance(finalBalance);
    this.logFn(`Amount credited. New balance: ${formattedBalance}`);
  }

  /**
   * Debit Account Operation
   * Equivalent to COBOL: IF OPERATION-TYPE = 'DEBIT'
   * - Prompts user for debit amount
   * - Retrieves current balance from data layer
   * - Validates sufficient funds
   * - If funds available: subtracts amount and updates balance
   * - If insufficient funds: displays error message and prevents transaction
   * Business Rule: Balance must never go negative
   */
  debitAccount() {
    const amountStr = String(this.promptFn('Enter debit amount: ') || '').trim();
    const amount = parseFloat(amountStr);

    // Validate input
    if (isNaN(amount) || amount < 0) {
      this.logFn('Invalid amount entered.');
      return;
    }

    // CALL 'DataProgram' USING 'READ'
    const finalBalance = this.data.read();

    // IF FINAL-BALANCE >= AMOUNT
    if (finalBalance >= amount) {
      // SUBTRACT AMOUNT FROM FINAL-BALANCE
      const newBalance = finalBalance - amount;

      // CALL 'DataProgram' USING 'WRITE'
      this.data.write(newBalance);

      // DISPLAY confirmation message
      const formattedBalance = formatBalance(newBalance);
      this.logFn(`Amount debited. New balance: ${formattedBalance}`);
    } else {
      // Business Rule: Insufficient funds prevents transaction
      // DISPLAY error message
      this.logFn('Insufficient funds for this debit.');
    }
  }
}

/**
 * ===========================
 * MAIN PROGRAM (from main.cob)
 * ===========================
 * Entry point and menu interface for the Account Management System
 */
class MainProgram {
  constructor(promptFn, logFn) {
    this.promptFn = promptFn;
    this.logFn = logFn || console.log;
    this.dataLayer = new DataLayer();
    this.operations = new Operations(this.dataLayer, this.promptFn, this.logFn);
    this.continueFlag = true;
  }

  /**
   * Display the main menu
   */
  displayMenu() {
    this.logFn('--------------------------------');
    this.logFn('Account Management System');
    this.logFn('1. View Balance');
    this.logFn('2. Credit Account');
    this.logFn('3. Debit Account');
    this.logFn('4. Exit');
    this.logFn('--------------------------------');
  }

  /**
   * Run the main program loop
   * Equivalent to COBOL: PERFORM UNTIL CONTINUE-FLAG = 'NO'
   */
  run() {
    // PERFORM UNTIL CONTINUE-FLAG = 'NO'
    while (this.continueFlag) {
      this.displayMenu();

      // DISPLAY "Enter your choice (1-4): "
      // ACCEPT USER-CHOICE
      const choice = String(this.promptFn('Enter your choice (1-4): ') || '').trim();

      // EVALUATE USER-CHOICE
      switch (choice) {
        case '1':
          // WHEN 1: CALL 'Operations' USING 'TOTAL'
          this.operations.viewBalance();
          break;

        case '2':
          // WHEN 2: CALL 'Operations' USING 'CREDIT'
          this.operations.creditAccount();
          break;

        case '3':
          // WHEN 3: CALL 'Operations' USING 'DEBIT'
          this.operations.debitAccount();
          break;

        case '4':
          // WHEN 4: MOVE 'NO' TO CONTINUE-FLAG
          this.continueFlag = false;
          break;

        default:
          // WHEN OTHER: DISPLAY "Invalid choice..."
          this.logFn('Invalid choice, please select 1-4.');
      }
      // END-EVALUATE
    }
    // END-PERFORM

    // DISPLAY "Exiting the program. Goodbye!"
    this.logFn('Exiting the program. Goodbye!');
  }
}

/**
 * ===========================
 * APPLICATION ENTRY POINT
 * ===========================
 */
if (require.main === module) {
  const prompt = require('prompt-sync')();
  const app = new MainProgram(prompt, console.log);
  app.run();
}

module.exports = {
  DataLayer,
  Operations,
  MainProgram,
  formatBalance,
};
