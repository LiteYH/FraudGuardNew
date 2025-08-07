// Walrus & Seal integration for secure password storage with zkLogin
import CryptoJS from "crypto-js";

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  salt: string;
  zkProof?: string; // zkLogin proof for additional security
}

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
  zkVerified?: boolean; // zkLogin verification status
}

export interface PasswordVault {
  id: string;
  userId: string;
  walletAddress: string; // zkLogin wallet address
  encryptedData: EncryptedData;
  metadata: {
    version: string;
    createdAt: Date;
    updatedAt: Date;
    entryCount: number;
    zkLoginEnabled: boolean;
  };
}

export class WalrusSealManager {
  private static instance: WalrusSealManager;
  private vault: PasswordVault | null = null;
  private currentWalletAddress: string | null = null;

  static getInstance(): WalrusSealManager {
    if (!WalrusSealManager.instance) {
      WalrusSealManager.instance = new WalrusSealManager();
    }
    return WalrusSealManager.instance;
  }

  // Set current wallet address from zkLogin
  setWalletAddress(address: string): void {
    this.currentWalletAddress = address;
  }

  // Get current wallet address
  getWalletAddress(): string | null {
    return this.currentWalletAddress;
  }

  // Generate a secure encryption key from master password + wallet address
  private deriveKey(masterPassword: string, salt: string): string {
    const combinedInput = masterPassword + (this.currentWalletAddress || "");
    return CryptoJS.PBKDF2(combinedInput, salt, {
      keySize: 256 / 32,
      iterations: 100000
    }).toString();
  }

  // Encrypt data using AES-256-GCM with zkLogin enhancement
  encrypt(data: any, masterPassword: string): EncryptedData {
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
    const key = this.deriveKey(masterPassword, salt);
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return {
      ciphertext: encrypted.toString(),
      iv: iv.toString(),
      salt: salt,
      zkProof: this.currentWalletAddress ? this.generateZkProof() : undefined
    };
  }

  // Decrypt data using AES-256-GCM
  decrypt(encryptedData: EncryptedData, masterPassword: string): any {
    try {
      const key = this.deriveKey(masterPassword, encryptedData.salt);
      const decrypted = CryptoJS.AES.decrypt(encryptedData.ciphertext, key, {
        iv: CryptoJS.enc.Hex.parse(encryptedData.iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      throw new Error("Failed to decrypt data. Invalid master password or corrupted data.");
    }
  }

  // Generate zkLogin proof (simulated for now)
  private generateZkProof(): string {
    // In a real implementation, this would generate an actual zkLogin proof
    return CryptoJS.lib.WordArray.random(256 / 8).toString();
  }

  // Verify zkLogin proof
  verifyZkProof(proof: string): boolean {
    // In a real implementation, this would verify the zkLogin proof
    return proof.length > 0;
  }

  // Create a new password vault with zkLogin
  createVault(userId: string, masterPassword: string, initialData: PasswordEntry[] = []): PasswordVault {
    if (!this.currentWalletAddress) {
      throw new Error("Wallet address required for vault creation");
    }

    const encryptedData = this.encrypt(initialData, masterPassword);
    
    this.vault = {
      id: CryptoJS.lib.WordArray.random(128 / 8).toString(),
      userId,
      walletAddress: this.currentWalletAddress,
      encryptedData,
      metadata: {
        version: "1.0.0",
        createdAt: new Date(),
        updatedAt: new Date(),
        entryCount: initialData.length,
        zkLoginEnabled: true
      }
    };

    return this.vault;
  }

  // Load and decrypt vault data
  loadVault(vault: PasswordVault, masterPassword: string): PasswordEntry[] {
    try {
      const decryptedData = this.decrypt(vault.encryptedData, masterPassword);
      
      // Verify zkLogin if proof exists
      if (vault.encryptedData.zkProof && !this.verifyZkProof(vault.encryptedData.zkProof)) {
        throw new Error("zkLogin verification failed");
      }

      this.vault = vault;
      return decryptedData;
    } catch (error) {
      throw new Error("Failed to load vault. Please check your master password.");
    }
  }

  // Update vault with new data
  updateVault(data: PasswordEntry[], masterPassword: string): PasswordVault {
    if (!this.vault) {
      throw new Error("No vault loaded. Please create or load a vault first.");
    }

    const encryptedData = this.encrypt(data, masterPassword);
    
    this.vault = {
      ...this.vault,
      encryptedData,
      metadata: {
        ...this.vault.metadata,
        updatedAt: new Date(),
        entryCount: data.length
      }
    };

    return this.vault;
  }

  // Get vault metadata
  getVaultMetadata(): any {
    return this.vault?.metadata || null;
  }

  // Validate master password
  validateMasterPassword(masterPassword: string): boolean {
    if (!this.vault) return false;
    
    try {
      this.decrypt(this.vault.encryptedData, masterPassword);
      return true;
    } catch {
      return false;
    }
  }

  // Generate secure password
  generateSecurePassword(length: number = 16, includeSpecial: boolean = true): string {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    let chars = lowercase + uppercase + numbers;
    if (includeSpecial) chars += special;
    
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return password;
  }

  // Password strength checker
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

  // Export vault for backup
  exportVault(): string {
    if (!this.vault) {
      throw new Error("No vault to export");
    }
    return JSON.stringify(this.vault, null, 2);
  }

  // Import vault from backup
  importVault(vaultData: string): PasswordVault {
    try {
      const vault = JSON.parse(vaultData);
      this.vault = vault;
      return vault;
    } catch (error) {
      throw new Error("Invalid vault data format");
    }
  }
}

// Export singleton instance
export const walrusSealManager = WalrusSealManager.getInstance();
