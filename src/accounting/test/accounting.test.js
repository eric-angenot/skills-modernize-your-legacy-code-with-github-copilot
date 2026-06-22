const { DataLayer, Operations, MainProgram } = require('../index');

function createPrompt(inputs) {
  let i = 0;
  return () => {
    if (i >= inputs.length) {
      return '';
    }
    const value = inputs[i];
    i += 1;
    return value;
  };
}

function createLogger() {
  const lines = [];
  const log = (line) => lines.push(String(line));
  return { lines, log };
}

function runMainWithInputs(inputs) {
  const prompt = createPrompt(inputs);
  const logger = createLogger();
  const app = new MainProgram(prompt, logger.log);
  app.run();
  return { app, lines: logger.lines };
}

describe('COBOL parity test plan scenarios', () => {
  test('TC-001 View Balance - Initial Balance', () => {
    const data = new DataLayer();
    const logger = createLogger();
    const ops = new Operations(data, createPrompt([]), logger.log);

    ops.viewBalance();

    expect(logger.lines).toContain('Current balance: 001000.00');
  });

  test('TC-002 View Balance - After Credit', () => {
    const data = new DataLayer();
    const logger = createLogger();
    const ops = new Operations(data, createPrompt(['500']), logger.log);

    ops.creditAccount();
    ops.viewBalance();

    expect(logger.lines).toContain('Current balance: 001500.00');
  });

  test('TC-003 View Balance - After Debit', () => {
    const data = new DataLayer();
    data.write(1000);
    const logger = createLogger();
    const ops = new Operations(data, createPrompt(['300']), logger.log);

    ops.debitAccount();
    ops.viewBalance();

    expect(logger.lines).toContain('Current balance: 000700.00');
  });

  test('TC-004 View Balance - After Multiple Transactions', () => {
    const data = new DataLayer();
    const logger = createLogger();
    const ops = new Operations(data, createPrompt(['500', '200']), logger.log);

    ops.creditAccount();
    ops.debitAccount();
    ops.viewBalance();

    expect(logger.lines).toContain('Current balance: 001300.00');
  });

  test('TC-005 Credit Account - Add 500', () => {
    const data = new DataLayer();
    const logger = createLogger();
    const ops = new Operations(data, createPrompt(['500']), logger.log);

    ops.creditAccount();

    expect(data.read()).toBeCloseTo(1500.0, 2);
    expect(logger.lines).toContain('Amount credited. New balance: 001500.00');
  });

  test('TC-006 Credit Account - Add 0', () => {
    const data = new DataLayer();
    const logger = createLogger();
    const ops = new Operations(data, createPrompt(['0']), logger.log);

    ops.creditAccount();

    expect(data.read()).toBeCloseTo(1000.0, 2);
    expect(logger.lines).toContain('Amount credited. New balance: 001000.00');
  });

  test('TC-007 Credit Account - Add Large Amount', () => {
    const data = new DataLayer();
    const logger = createLogger();
    const ops = new Operations(data, createPrompt(['500000']), logger.log);

    ops.creditAccount();

    expect(data.read()).toBeCloseTo(501000.0, 2);
    expect(logger.lines).toContain('Amount credited. New balance: 501000.00');
  });

  test('TC-008 Credit Account - Maximum Balance Boundary', () => {
    const data = new DataLayer();
    data.write(900000.99);
    const logger = createLogger();
    const ops = new Operations(data, createPrompt(['99999']), logger.log);

    ops.creditAccount();

    expect(data.read()).toBeCloseTo(999999.99, 2);
    expect(logger.lines).toContain('Amount credited. New balance: 999999.99');
  });

  test('TC-009 Credit Account - Exceed Maximum Boundary (current behavior)', () => {
    const data = new DataLayer();
    data.write(900000.0);
    const logger = createLogger();
    const ops = new Operations(data, createPrompt(['100000']), logger.log);

    ops.creditAccount();

    expect(data.read()).toBeCloseTo(1000000.0, 2);
    expect(logger.lines).toContain('Amount credited. New balance: 1000000.00');
  });

  test('TC-010 Debit Account - Subtract 300', () => {
    const data = new DataLayer();
    const logger = createLogger();
    const ops = new Operations(data, createPrompt(['300']), logger.log);

    ops.debitAccount();

    expect(data.read()).toBeCloseTo(700.0, 2);
    expect(logger.lines).toContain('Amount debited. New balance: 000700.00');
  });

  test('TC-011 Debit Account - Subtract Equal to Balance', () => {
    const data = new DataLayer();
    const logger = createLogger();
    const ops = new Operations(data, createPrompt(['1000']), logger.log);

    ops.debitAccount();

    expect(data.read()).toBeCloseTo(0.0, 2);
    expect(logger.lines).toContain('Amount debited. New balance: 000000.00');
  });

  test('TC-012 Debit Account - Subtract 0', () => {
    const data = new DataLayer();
    const logger = createLogger();
    const ops = new Operations(data, createPrompt(['0']), logger.log);

    ops.debitAccount();

    expect(data.read()).toBeCloseTo(1000.0, 2);
    expect(logger.lines).toContain('Amount debited. New balance: 001000.00');
  });

  test('TC-013 Debit Account - Insufficient Funds', () => {
    const data = new DataLayer();
    data.write(500);
    const logger = createLogger();
    const ops = new Operations(data, createPrompt(['600']), logger.log);

    ops.debitAccount();

    expect(data.read()).toBeCloseTo(500.0, 2);
    expect(logger.lines).toContain('Insufficient funds for this debit.');
  });

  test('TC-014 Debit Account - Exact Amount Over', () => {
    const data = new DataLayer();
    data.write(999.99);
    const logger = createLogger();
    const ops = new Operations(data, createPrompt(['1000']), logger.log);

    ops.debitAccount();

    expect(data.read()).toBeCloseTo(999.99, 2);
    expect(logger.lines).toContain('Insufficient funds for this debit.');
  });

  test('TC-015 Debit Account - Prevent Negative Balance', () => {
    const data = new DataLayer();
    data.write(100);
    const logger = createLogger();
    const ops = new Operations(data, createPrompt(['150']), logger.log);

    ops.debitAccount();

    expect(data.read()).toBeCloseTo(100.0, 2);
    expect(logger.lines).toContain('Insufficient funds for this debit.');
  });

  test('TC-016 Menu Navigation - Valid Option 1', () => {
    const { lines } = runMainWithInputs(['1', '4']);

    const menuCount = lines.filter((line) => line === 'Account Management System').length;
    expect(menuCount).toBe(2);
    expect(lines).toContain('Current balance: 001000.00');
  });

  test('TC-017 Menu Navigation - Valid Option 2', () => {
    const { lines } = runMainWithInputs(['2', '100', '4']);

    expect(lines).toContain('Amount credited. New balance: 001100.00');
    const menuCount = lines.filter((line) => line === 'Account Management System').length;
    expect(menuCount).toBe(2);
  });

  test('TC-018 Menu Navigation - Valid Option 3', () => {
    const { lines } = runMainWithInputs(['3', '100', '4']);

    expect(lines).toContain('Amount debited. New balance: 000900.00');
    const menuCount = lines.filter((line) => line === 'Account Management System').length;
    expect(menuCount).toBe(2);
  });

  test('TC-019 Menu Navigation - Exit Option 4', () => {
    const { lines } = runMainWithInputs(['4']);

    expect(lines).toContain('Exiting the program. Goodbye!');
  });

  test('TC-020 Menu Navigation - Invalid Option 0', () => {
    const { lines } = runMainWithInputs(['0', '4']);

    expect(lines).toContain('Invalid choice, please select 1-4.');
  });

  test('TC-021 Menu Navigation - Invalid Option 5', () => {
    const { lines } = runMainWithInputs(['5', '4']);

    expect(lines).toContain('Invalid choice, please select 1-4.');
  });

  test('TC-022 Menu Navigation - Invalid Option 999', () => {
    const { lines } = runMainWithInputs(['999', '4']);

    expect(lines).toContain('Invalid choice, please select 1-4.');
  });

  test('TC-023 Balance Persistence - Credit Then View', () => {
    const { lines } = runMainWithInputs(['2', '500', '1', '4']);

    expect(lines).toContain('Amount credited. New balance: 001500.00');
    expect(lines).toContain('Current balance: 001500.00');
  });

  test('TC-024 Balance Persistence - Debit Then View', () => {
    const { lines } = runMainWithInputs(['2', '500', '3', '300', '1', '4']);

    expect(lines).toContain('Amount debited. New balance: 001200.00');
    expect(lines).toContain('Current balance: 001200.00');
  });

  test('TC-025 Balance Precision - Credit with Decimals', () => {
    const { lines } = runMainWithInputs(['2', '123.45', '1', '4']);

    expect(lines).toContain('Amount credited. New balance: 001123.45');
    expect(lines).toContain('Current balance: 001123.45');
  });

  test('TC-026 Balance Precision - Debit with Decimals', () => {
    const data = new DataLayer();
    data.write(1500.5);
    const logger = createLogger();
    const ops = new Operations(data, createPrompt(['250.50']), logger.log);

    ops.debitAccount();
    ops.viewBalance();

    expect(logger.lines).toContain('Amount debited. New balance: 001250.00');
    expect(logger.lines).toContain('Current balance: 001250.00');
  });

  test('TC-027 Sequential Transactions - Credit, Debit, Credit', () => {
    const { lines } = runMainWithInputs(['2', '500', '3', '200', '2', '300', '1', '4']);

    expect(lines).toContain('Current balance: 001600.00');
  });

  test('TC-028 Sequential Transactions - Multiple Debits', () => {
    const { lines } = runMainWithInputs(['3', '100', '3', '200', '3', '150', '1', '4']);

    expect(lines).toContain('Current balance: 000550.00');
  });

  test('TC-029 Business Rule - No Negative Balance', () => {
    const data = new DataLayer();
    data.write(500);
    const logger = createLogger();
    const ops = new Operations(data, createPrompt(['600']), logger.log);

    ops.debitAccount();

    expect(data.read()).toBe(500);
    expect(logger.lines).toContain('Insufficient funds for this debit.');
  });

  test('TC-030 Business Rule - Credit Limit Validation boundary behavior', () => {
    const data = new DataLayer();
    data.write(999000);
    const logger = createLogger();
    const ops = new Operations(data, createPrompt(['1000']), logger.log);

    ops.creditAccount();

    expect(data.read()).toBeCloseTo(1000000.0, 2);
  });

  test('TC-031 Data Isolation - Credit Does Not Affect View Operation', () => {
    const { lines } = runMainWithInputs(['2', '500', '1', '4']);

    expect(lines).toContain('Current balance: 001500.00');
  });

  test('TC-032 Data Isolation - Debit Preserves Balance Format', () => {
    const { lines } = runMainWithInputs(['3', '100', '1', '4']);

    expect(lines).toContain('Current balance: 000900.00');
  });
});
