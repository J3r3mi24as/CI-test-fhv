import { TerminalUI } from '../src/ui/terminalUI';
import { DbService } from '../src/services/dbService';
import readline from 'readline';

type Function = (s1: string) => void

// Mock readline
jest.mock('readline', () => ({
  createInterface: jest.fn().mockReturnValue({
    question: jest.fn(),
    close: jest.fn(),
  }),
}));

describe('TerminalUI Tests', () => {
  let terminalUI: TerminalUI;
  let mockDbService: jest.Mocked<DbService>;
  let mockReadline: any;

  beforeEach(() => {
    // Mock DbService
    mockDbService = {
      connect: jest.fn().mockResolvedValue(undefined),
      close: jest.fn().mockResolvedValue(undefined),
      run: jest.fn().mockResolvedValue(undefined),
      all: jest.fn().mockResolvedValue([]),
      getAllItems: jest.fn().mockResolvedValue([]),
      insertItem: jest.fn().mockResolvedValue({ id: 1, name: 'Test', description: 'Test Desc' }),
      updateItem: jest.fn().mockResolvedValue({ id: 1, name: 'Updated', description: 'Updated Desc' }),
      deleteItem: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<DbService>;

    // Create mock readline instance
    mockReadline = (readline.createInterface as jest.Mock)();
    mockReadline.question = jest.fn();
    
    // Create terminalUI instance with mock DbService
    terminalUI = new TerminalUI(mockDbService);
  });

  it('should initialize correctly', () => {
    expect(terminalUI).toBeDefined();
    expect(readline.createInterface).toHaveBeenCalled();
  });

  it('should start and display the main menu', () => {
    // Mock console.log
    const consoleSpy = jest.spyOn(console, 'log');
    
    terminalUI.start();
    
    expect(consoleSpy).toHaveBeenCalledWith('===== Item Management Terminal UI =====');
    expect(consoleSpy).toHaveBeenCalledWith('\nMain Menu:');
    
    consoleSpy.mockRestore();
  });

  it('should handle list items option', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const mockItems = [
      { id: 1, name: 'Item 1', description: 'Description 1' },
      { id: 2, name: 'Item 2', description: 'Description 2' }
    ];
    
    mockDbService.getAllItems.mockResolvedValueOnce(mockItems);
    
    // Simulate selecting option 1 from the main menu
    mockReadline.question.mockImplementationOnce((question: string, callback: (s1: string) => void
    ) => {
      callback('1');
    });
    
    terminalUI.start();
    
    // Wait for the async operations to complete
    await new Promise(process.nextTick);
    
    expect(mockDbService.getAllItems).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('\n===== All Items =====');
    expect(consoleSpy).toHaveBeenCalledWith('ID: 1 | Name: Item 1 | Description: Description 1');
    expect(consoleSpy).toHaveBeenCalledWith('ID: 2 | Name: Item 2 | Description: Description 2');
    
    consoleSpy.mockRestore();
  });

  it('should handle list items when no items exist', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    mockDbService.getAllItems.mockResolvedValueOnce([]);
    
    // Simulate selecting option 1 from the main menu
    mockReadline.question.mockImplementationOnce((question: string, callback: Function) => {
      callback('1');
    });
    
    terminalUI.start();
    
    // Wait for the async operations to complete
    await new Promise(process.nextTick);
    
    expect(mockDbService.getAllItems).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('\n===== All Items =====');
    expect(consoleSpy).toHaveBeenCalledWith('No items found.');
    
    consoleSpy.mockRestore();
  });

  it('should handle add item option', async () => {
    // Simulate user selecting option 2 (add item) and entering item details
    mockReadline.question
      .mockImplementationOnce((question: string, callback: Function) => {
        // First call for menu option
        callback('2');
      })
      .mockImplementationOnce((question: string, callback: Function) => {
        // Second call for item name
        expect(question).toContain('Enter item name');
        callback('New Item');
      })
      .mockImplementationOnce((question: string, callback: Function) => {
        // Third call for item description
        expect(question).toContain('Enter item description');
        callback('New Description');
      });
    
    terminalUI.start();
    
    // Wait for the async operations to complete
    await new Promise(process.nextTick);
    
    expect(mockDbService.insertItem).toHaveBeenCalledWith({
      name: 'New Item',
      description: 'New Description'
    });
  });

  it('should handle update item option', async () => {
    const mockItem = { id: 1, name: 'Original Item', description: 'Original Description' };
    mockDbService.getAllItems.mockResolvedValueOnce([mockItem]);
    
    // Simulate user selecting option 3 (update item) and entering item details
    mockReadline.question
      .mockImplementationOnce((question: string, callback: Function) => {
        // First call for menu option
        callback('3');
      })
      .mockImplementationOnce((question: string, callback: Function) => {
        // Second call for item ID
        expect(question).toContain('Enter item ID');
        callback('1');
      })
      .mockImplementationOnce((question: string, callback: Function) => {
        // Third call for new name
        callback('Updated Item');
      })
      .mockImplementationOnce((question: string, callback: Function) => {
        // Fourth call for new description
        callback('Updated Description');
      });
    
    terminalUI.start();
    
    // Wait for the async operations to complete
    await new Promise(process.nextTick);
    
    expect(mockDbService.updateItem).toHaveBeenCalledWith('1', {
      name: 'Updated Item',
      description: 'Updated Description'
    });
  });

  it('should handle update item when keeping original values', async () => {
    const mockItem = { id: 1, name: 'Original Item', description: 'Original Description' };
    mockDbService.getAllItems.mockResolvedValueOnce([mockItem]);
    
    // Simulate user selecting option 3 (update item) and entering item details
    mockReadline.question
      .mockImplementationOnce((question: string, callback: Function) => {
        callback('3');
      })
      .mockImplementationOnce((question: string, callback: Function) => {
        callback('1');
      })
      .mockImplementationOnce((question: string, callback: Function) => {
        // Empty name (keep original)
        callback('');
      })
      .mockImplementationOnce((question: string, callback: Function) => {
        // Empty description (keep original)
        callback('');
      });
    
    terminalUI.start();
    
    // Wait for the async operations to complete
    await new Promise(process.nextTick);
    
    expect(mockDbService.updateItem).toHaveBeenCalledWith('1', {
      name: 'Original Item',
      description: 'Original Description'
    });
  });

  it('should handle delete item option', async () => {
    // Simulate user selecting option 4 (delete item) and entering item ID
    mockReadline.question
      .mockImplementationOnce((question: string, callback: Function) => {
        // First call for menu option
        callback('4');
      })
      .mockImplementationOnce((question: string, callback: Function) => {
        // Second call for item ID
        expect(question).toContain('Enter item ID');
        callback('1');
      });
    
    terminalUI.start();
    
    // Wait for the async operations to complete
    await new Promise(process.nextTick);
    
    expect(mockDbService.deleteItem).toHaveBeenCalledWith('1');
  });

  it('should handle exit option', () => {
    // Mock process.exit
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
      return undefined as never;
    });
    
    // Simulate user selecting option 5 (exit)
    mockReadline.question.mockImplementationOnce((question: string, callback: Function) => {
      callback('5');
    });
    
    terminalUI.start();
    
    expect(mockReadline.close).toHaveBeenCalled();
    expect(mockExit).toHaveBeenCalledWith(0);
    
    mockExit.mockRestore();
  });

  it('should handle invalid menu option', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    
    // Simulate user selecting invalid option
    mockReadline.question.mockImplementationOnce((question: string, callback: Function) => {
      callback('invalid');
    });
    
    terminalUI.start();
    
    expect(consoleSpy).toHaveBeenCalledWith('Invalid option. Please try again.');
    
    consoleSpy.mockRestore();
  });

});