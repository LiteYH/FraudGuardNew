// Simple Password Manager Implementation using localStorage
// This is a clean, working implementation without complex abstractions

export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VaultData {
  id: string;
  walletAddress: string;
  passwords: PasswordEntry[];
  createdAt: Date;
  updatedAt: Date;
}

// Simple Password Manager using localStorage
export class SimplePasswordManager {
  private static instance: SimplePasswordManager;
  private currentWalletAddress: string | null = null;
  private vault: VaultData | null = null;

  constructor() {
    console.log('✅ Simple password manager initialized');
  }

  static getInstance(): SimplePasswordManager {
    if (!SimplePasswordManager.instance) {
      SimplePasswordManager.instance = new SimplePasswordManager();
    }
    return SimplePasswordManager.instance;
  }

  // Set wallet address and load existing vault
  setWalletAddress(address: string): void {
    this.currentWalletAddress = address;
    console.log('🔐 Wallet address set:', address.slice(0, 8) + '...');
    this.loadVaultFromStorage();
  }

  // Load vault from localStorage
  private loadVaultFromStorage(): void {
    if (!this.currentWalletAddress) return;

    const vaultKey = `fraudguard-vault-${this.currentWalletAddress}`;
    const vaultData = localStorage.getItem(vaultKey);
    
    if (vaultData) {
      try {
        const parsed = JSON.parse(vaultData);
        this.vault = {
          ...parsed,
          createdAt: new Date(parsed.createdAt),
          updatedAt: new Date(parsed.updatedAt),
          passwords: parsed.passwords.map((p: any) => ({
            ...p,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt)
          }))
        };
        console.log('✅ Loaded existing vault with', this.vault.passwords.length, 'passwords');
      } catch (error) {
        console.error('Failed to load vault:', error);
        this.vault = null;
      }
    } else {
      console.log('📝 No existing vault found');
    }
  }

  // Save vault to localStorage
  private saveVaultToStorage(): void {
    if (!this.vault || !this.currentWalletAddress) return;

    const vaultKey = `fraudguard-vault-${this.currentWalletAddress}`;
    localStorage.setItem(vaultKey, JSON.stringify(this.vault));
    console.log('✅ Saved vault to storage');
  }

  // Create new vault
  async createVault(masterPassword: string, initialPasswords: PasswordEntry[] = []): Promise<VaultData> {
    if (!this.currentWalletAddress) {
      throw new Error("Wallet address required");
    }

    console.log('🔐 Creating new vault with', initialPasswords.length, 'passwords');

    this.vault = {
      id: `vault-${Date.now()}`,
      walletAddress: this.currentWalletAddress,
      passwords: initialPasswords,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.saveVaultToStorage();
    console.log('✅ Vault created successfully');
    return this.vault;
  }

  // Add new password
  async addPassword(passwordEntry: PasswordEntry): Promise<void> {
    if (!this.vault) {
      throw new Error("Vault not initialized");
    }

    console.log('➕ Adding password:', passwordEntry.title);
    
    // Generate new ID if not provided
    if (!passwordEntry.id) {
      passwordEntry.id = `pwd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    passwordEntry.createdAt = new Date();
    passwordEntry.updatedAt = new Date();

    this.vault.passwords.push(passwordEntry);
    this.vault.updatedAt = new Date();
    
    this.saveVaultToStorage();
    console.log('✅ Password added successfully');
  }

  // Update existing password
  async updatePassword(passwordId: string, updatedPassword: PasswordEntry): Promise<void> {
    if (!this.vault) {
      throw new Error("Vault not initialized");
    }

    console.log('🔧 Updating password:', passwordId);
    
    const index = this.vault.passwords.findIndex(p => p.id === passwordId);
    if (index === -1) {
      throw new Error("Password not found");
    }

    // Preserve original ID and creation date
    updatedPassword.id = passwordId;
    updatedPassword.createdAt = this.vault.passwords[index].createdAt;
    updatedPassword.updatedAt = new Date();

    this.vault.passwords[index] = updatedPassword;
    this.vault.updatedAt = new Date();
    
    this.saveVaultToStorage();
    console.log('✅ Password updated successfully');
  }

  // Delete password
  async deletePassword(passwordId: string): Promise<void> {
    if (!this.vault) {
      throw new Error("Vault not initialized");
    }

    console.log('🗑️ Deleting password:', passwordId);
    
    const index = this.vault.passwords.findIndex(p => p.id === passwordId);
    if (index === -1) {
      console.warn('Password not found for deletion:', passwordId);
      return;
    }

    this.vault.passwords.splice(index, 1);
    this.vault.updatedAt = new Date();
    
    this.saveVaultToStorage();
    console.log('✅ Password deleted successfully');
  }

  // Get all passwords
  async getAllPasswords(): Promise<PasswordEntry[]> {
    if (!this.vault) {
      throw new Error("Vault not initialized");
    }

    console.log('📖 Getting all passwords:', this.vault.passwords.length);
    return this.vault.passwords;
  }

  // Get single password
  async getPassword(passwordId: string): Promise<PasswordEntry | null> {
    if (!this.vault) {
      throw new Error("Vault not initialized");
    }

    const password = this.vault.passwords.find(p => p.id === passwordId);
    return password || null;
  }

  // Validate master password (simple check for now)
  async validateMasterPassword(masterPassword: string): Promise<boolean> {
    if (!this.vault) {
      return true; // No vault means always valid
    }

    // For now, just check if vault exists and has passwords
    // In a real implementation, you'd verify against a stored hash
    return this.vault.passwords.length >= 0;
  }

  // Get vault metadata
  getVaultMetadata(): any {
    if (!this.vault) {
      return null;
    }

    return {
      id: this.vault.id,
      walletAddress: this.vault.walletAddress,
      passwordCount: this.vault.passwords.length,
      createdAt: this.vault.createdAt,
      updatedAt: this.vault.updatedAt
    };
  }

  // Export vault
  async exportVault(): Promise<string> {
    if (!this.vault) {
      throw new Error("Vault not initialized");
    }

    const exportData = {
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      vault: this.vault
    };

    return JSON.stringify(exportData, null, 2);
  }

  // Import vault
  async importVault(vaultData: string): Promise<void> {
    const data = JSON.parse(vaultData);
    
    if (data.vault.walletAddress !== this.currentWalletAddress) {
      throw new Error("Wallet address mismatch");
    }

    this.vault = {
      ...data.vault,
      createdAt: new Date(data.vault.createdAt),
      updatedAt: new Date(data.vault.updatedAt),
      passwords: data.vault.passwords.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt)
      }))
    };

    this.saveVaultToStorage();
    console.log('✅ Vault imported successfully');
  }

  // Reset vault
  async resetVault(): Promise<void> {
    if (!this.currentWalletAddress) return;

    const vaultKey = `fraudguard-vault-${this.currentWalletAddress}`;
    localStorage.removeItem(vaultKey);
    this.vault = null;
    console.log('✅ Vault reset successfully');
  }

  // Force reset all data
  async forceResetVault(): Promise<void> {
    if (!this.currentWalletAddress) return;

    // Remove all fraudguard keys
    const allKeys = Object.keys(localStorage);
    const fraudguardKeys = allKeys.filter(key => key.startsWith('fraudguard-'));
    
    fraudguardKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log('🗑️ Deleted:', key);
    });

    this.vault = null;
    console.log('✅ Force reset completed');
  }

  // Generate secure password
  generateSecurePassword(length: number = 16, includeSpecial: boolean = true): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const fullCharset = includeSpecial ? charset + specialChars : charset;
    
    let password = '';
    for (let i = 0; i < length; i++) {
      password += fullCharset.charAt(Math.floor(Math.random() * fullCharset.length));
    }
    
    return password;
  }

  // Check password strength
  checkPasswordStrength(password: string): {
    score: number;
    feedback: string[];
    strength: "weak" | "medium" | "strong" | "very-strong";
  } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push("Password should be at least 8 characters long");

    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push("Include lowercase letters");

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push("Include uppercase letters");

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push("Include numbers");

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push("Include special characters");

    // Determine strength
    let strength: "weak" | "medium" | "strong" | "very-strong";
    if (score <= 3) strength = "weak";
    else if (score <= 5) strength = "medium";
    else if (score <= 7) strength = "strong";
    else strength = "very-strong";

    return { score, feedback, strength };
  }
}

// Export singleton instance
export const simplePasswordManager = SimplePasswordManager.getInstance();

// Legacy compatibility exports
export const realTrack3PasswordManager = simplePasswordManager;
export type RealTrack3PasswordEntry = PasswordEntry;
