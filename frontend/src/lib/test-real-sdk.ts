// Test file for Real SDK Implementation
import { realTrack3PasswordManager } from './walrus-seal-real';

// Test the real SDK implementation
export async function testRealSDK() {
  try {
    console.log('🧪 Testing Real SDK Implementation...');
    
    // Test 1: Initialize password manager
    realTrack3PasswordManager.setWalletAddress('test-wallet-address');
    console.log('✅ Password manager initialized');
    
    // Test 2: Generate secure password
    const securePassword = realTrack3PasswordManager.generateSecurePassword(16, true);
    console.log('✅ Secure password generated:', securePassword);
    
    // Test 3: Check password strength
    const strength = realTrack3PasswordManager.checkPasswordStrength(securePassword);
    console.log('✅ Password strength checked:', strength);
    
    // Test 4: Create vault
    const vault = await realTrack3PasswordManager.createVault('test-master-password');
    console.log('✅ Vault created:', vault.id);
    
    // Test 5: Add password
    const testPassword = {
      id: 'test-1',
      title: 'Test Account',
      username: 'testuser',
      password: 'testpass123',
      url: 'https://test.com',
      notes: 'Test password',
      category: 'Personal',
      createdAt: new Date(),
      updatedAt: new Date(),
      zkVerified: true,
      privacyLevel: 'private' as const
    };
    
    await realTrack3PasswordManager.addPassword(testPassword, 'test-master-password');
    console.log('✅ Password added');
    
    // Test 6: Get all passwords
    const passwords = await realTrack3PasswordManager.getAllPasswords('test-master-password');
    console.log('✅ Passwords retrieved:', passwords.length);
    
    // Test 7: Export vault
    const exportData = await realTrack3PasswordManager.exportVault('test-master-password');
    console.log('✅ Vault exported');
    
    // Test 8: Get vault metadata
    const metadata = realTrack3PasswordManager.getVaultMetadata();
    console.log('✅ Vault metadata:', metadata);
    
    console.log('🎉 All Real SDK tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Real SDK test failed:', error);
    return false;
  }
}

// Export for use in components
export default testRealSDK;
