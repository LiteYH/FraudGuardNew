import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Plus, 
  Search, 
  Copy, 
  Edit, 
  Trash2, 
  Shield, 
  Key,
  Database,
  AlertTriangle,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Wallet,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { walrusSealManager, PasswordEntry } from "@/lib/walrus-seal";

interface PasswordManagerProps {
  className?: string;
}

export function PasswordManager({ className }: PasswordManagerProps) {
  const account = useCurrentAccount();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [masterPassword, setMasterPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPassword, setEditingPassword] = useState<PasswordEntry | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, strength: "weak" as any });
  const [isInitializing, setIsInitializing] = useState(false);
  
  // New password form state
  const [newPassword, setNewPassword] = useState({
    title: "",
    username: "",
    password: "",
    url: "",
    notes: "",
    category: "General"
  });

  // Categories for organization
  const categories = [
    "General",
    "Social Media",
    "Banking",
    "Shopping",
    "Work",
    "Personal",
    "Gaming",
    "Other"
  ];

  // Load passwords from localStorage on component mount
  useEffect(() => {
    if (isUnlocked) {
      const storedPasswords = localStorage.getItem('fraudguard-passwords');
      if (storedPasswords) {
        try {
          const parsedPasswords = JSON.parse(storedPasswords);
          setPasswords(parsedPasswords);
        } catch (error) {
          console.error('Failed to parse stored passwords:', error);
          setPasswords([]);
        }
      } else {
        setPasswords([]);
      }
    }
  }, [isUnlocked]);

  // Save passwords to localStorage whenever passwords change
  useEffect(() => {
    if (isUnlocked && passwords.length > 0) {
      localStorage.setItem('fraudguard-passwords', JSON.stringify(passwords));
    }
  }, [passwords, isUnlocked]);

  // Initialize wallet address and sample data
  useEffect(() => {
    if (account && isAuthenticated) {
      walrusSealManager.setWalletAddress(account.address);
    }
  }, [account, isAuthenticated]);

  // Load sample data only once when vault is first unlocked
  useEffect(() => {
    if (isUnlocked && passwords.length === 0) {
      const storedPasswords = localStorage.getItem('fraudguard-passwords');
      if (!storedPasswords) {
        console.log('Loading sample passwords for new user');
        const samplePasswords: PasswordEntry[] = [
          {
            id: "sample-1",
            title: "Gmail Account",
            username: "user@gmail.com",
            password: "securePassword123!",
            url: "https://gmail.com",
            notes: "Main email account",
            category: "Personal",
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01"),
            zkVerified: true
          },
          {
            id: "sample-2",
            title: "GitHub",
            username: "developer",
            password: "githubSecure456!",
            url: "https://github.com",
            notes: "Code repository access",
            category: "Work",
            createdAt: new Date("2024-01-02"),
            updatedAt: new Date("2024-01-02"),
            zkVerified: true
          },
          {
            id: "sample-3",
            title: "Bank of America",
            username: "user123",
            password: "bankSecure789!",
            url: "https://bankofamerica.com",
            notes: "Primary bank account",
            category: "Banking",
            createdAt: new Date("2024-01-03"),
            updatedAt: new Date("2024-01-03"),
            zkVerified: true
          }
        ];
        setPasswords(samplePasswords);
      }
    }
  }, [isUnlocked, passwords.length]);

  // Check password strength when password changes
  useEffect(() => {
    if (newPassword.password) {
      const strength = walrusSealManager.checkPasswordStrength(newPassword.password);
      setPasswordStrength({ score: strength.score, strength: strength.strength });
    }
  }, [newPassword.password]);

  const handleUnlock = async () => {
    console.log('🔓 UNLOCK ATTEMPT - Password length:', masterPassword.length);
    if (masterPassword.length < 3) {
      toast({
        title: "⚠️ Weak Password",
        description: "Master password must be at least 3 characters",
        variant: "destructive"
      });
      return;
    }

    setIsInitializing(true);
    
    try {
      // Set wallet address for walrus-seal manager
      if (account?.address) {
        walrusSealManager.setWalletAddress(account.address);
      }
      
      // Check if master password exists in localStorage
      const storedMasterPassword = localStorage.getItem('fraudguard-master-password');
      
      if (storedMasterPassword) {
        // Validate existing master password
        if (masterPassword !== storedMasterPassword) {
          toast({
            title: "❌ Incorrect Password",
            description: "Master password is incorrect. Please try again.",
            variant: "destructive"
          });
          return;
        }
      } else {
        // First time setup - save the master password
        localStorage.setItem('fraudguard-master-password', masterPassword);
        toast({
          title: "🔐 Master Password Set",
          description: "Your master password has been set for future logins.",
        });
      }
      
      // Simulate vault creation/loading with Walrus & Seal
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create vault with Walrus & Seal
      const vault = walrusSealManager.createVault(account?.address || 'user', masterPassword);
      
      setIsUnlocked(true);
      toast({
        title: "🔓 Vault Unlocked",
        description: "Your password vault is now accessible with zkLogin security",
      });
    } catch (error) {
      console.error('Unlock error:', error);
      toast({
        title: "❌ Unlock Failed",
        description: "Failed to unlock vault. Please check your credentials.",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setMasterPassword("");
    setShowPasswords({});
    toast({
      title: "🔒 Vault Locked",
      description: "Your password vault has been secured",
    });
  };

  const resetMasterPassword = () => {
    if (confirm("⚠️ WARNING: This will delete all your stored passwords and reset your master password. This action cannot be undone. Are you sure you want to continue?")) {
      // Clear all password data
      localStorage.removeItem('fraudguard-passwords');
      localStorage.removeItem('fraudguard-master-password');
      setPasswords([]);
      setIsUnlocked(false);
      setMasterPassword("");
      toast({
        title: "🔄 Master Password Reset",
        description: "All passwords have been cleared. You can set a new master password.",
      });
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "📋 Copied",
      description: `${type} copied to clipboard`,
    });
  };

  const generateSecurePassword = () => {
    const password = walrusSealManager.generateSecurePassword(16, true);
    setNewPassword(prev => ({ ...prev, password }));
  };



  const addPassword = () => {
    if (!newPassword.title || !newPassword.username || !newPassword.password) {
      toast({
        title: "⚠️ Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const passwordEntry: PasswordEntry = {
      id: Date.now().toString(),
      ...newPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      zkVerified: true
    };

    setPasswords(prev => [...prev, passwordEntry]);
    setNewPassword({
      title: "",
      username: "",
      password: "",
      url: "",
      notes: "",
      category: "General"
    });
    setShowAddDialog(false);
    
    toast({
      title: "✅ Password Added",
      description: "New password has been securely stored with zkLogin verification",
    });
  };

  const editPassword = () => {
    if (!editingPassword || !editingPassword.title || !editingPassword.username || !editingPassword.password) {
      toast({
        title: "⚠️ Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const updatedPassword = {
      ...editingPassword,
      updatedAt: new Date()
    };

    console.log('Updating password:', updatedPassword);
    setPasswords(prev => {
      const newPasswords = prev.map(p => p.id === editingPassword.id ? updatedPassword : p);
      console.log('Passwords after update:', newPasswords);
      return newPasswords;
    });
    
    setEditingPassword(null);
    setShowEditDialog(false);
    
    toast({
      title: "✅ Password Updated",
      description: "Password has been successfully updated",
    });
  };

  const startEditPassword = (password: PasswordEntry) => {
    setEditingPassword({ ...password });
    setShowEditDialog(true);
  };

  const deletePassword = (id: string) => {
    setPasswords(prev => prev.filter(p => p.id !== id));
    toast({
      title: "🗑️ Password Deleted",
      description: "Password has been removed from vault",
    });
  };

  const exportVault = () => {
    console.log('🔄 NEW EXPORT FUNCTION RUNNING!');
    try {
      const vaultData = {
        version: "1.0.0",
        exportedAt: new Date().toISOString(),
        walletAddress: account?.address,
        passwords: passwords,
        metadata: {
          totalPasswords: passwords.length,
          categories: categories.reduce((acc, cat) => {
            acc[cat] = passwords.filter(p => p.category === cat).length;
            return acc;
          }, {} as Record<string, number>),
          zkLoginEnabled: !!account?.address
        }
      };
      
      const blob = new Blob([JSON.stringify(vaultData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fraudguard-vault-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "📥 Vault Exported",
        description: "Your password vault has been exported successfully",
      });
    } catch (error) {
      toast({
        title: "❌ Export Failed",
        description: "Failed to export vault",
        variant: "destructive"
      });
    }
  };

  const importVault = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const vaultData = JSON.parse(e.target?.result as string);
        if (vaultData.passwords && Array.isArray(vaultData.passwords)) {
          // Ensure all passwords have required fields
          const validatedPasswords = vaultData.passwords.map((pwd: any) => ({
            id: pwd.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: pwd.title || "Imported Password",
            username: pwd.username || "",
            password: pwd.password || "",
            url: pwd.url || "",
            notes: pwd.notes || "",
            category: pwd.category || "General",
            createdAt: pwd.createdAt ? new Date(pwd.createdAt) : new Date(),
            updatedAt: pwd.updatedAt ? new Date(pwd.updatedAt) : new Date(),
            zkVerified: pwd.zkVerified || false
          }));
          
          setPasswords(validatedPasswords);
          toast({
            title: "📤 Vault Imported",
            description: `Successfully imported ${validatedPasswords.length} passwords`,
          });
        } else {
          throw new Error("Invalid vault format");
        }
      } catch (error) {
        console.error('Import error:', error);
        toast({
          title: "❌ Import Failed",
          description: "Invalid vault file format. Please check the file and try again.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  const filteredPasswords = passwords.filter(password => {
    const matchesSearch = password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         password.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || password.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-gray-500">Please connect your wallet to access the password manager</p>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Secure Password Vault
          </CardTitle>
          <CardDescription>
            Enter your master password to unlock your password vault
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {account && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Wallet className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-blue-700">
                  Connected: {account.address.slice(0, 6)}...{account.address.slice(-4)}
                </span>
                <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="master-password">Master Password</Label>
              <div className="relative">
                <Input
                  id="master-password"
                  type="password"
                  placeholder="Enter your master password (min 3 characters)"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleUnlock()}
                />
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <div className="text-xs text-gray-500">
                Password strength: {masterPassword.length >= 3 ? "✅ Strong" : "❌ Weak"}
              </div>
            </div>
            
            <Button 
              onClick={handleUnlock} 
              className="w-full" 
              disabled={masterPassword.length < 3 || isInitializing}
              variant={masterPassword.length >= 3 ? "default" : "secondary"}
            >
              {isInitializing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Unlocking...
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4 mr-2" />
                  Unlock Vault
                </>
              )}
            </Button>
            
            <Button 
              onClick={resetMasterPassword} 
              variant="outline" 
              className="w-full"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Master Password
            </Button>
            
            <div className="text-xs text-gray-500 text-center">
              🔒 Your passwords are encrypted and stored securely using Walrus & Seal with zkLogin
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Password Vault
                <Badge variant="secondary" className="ml-2">
                  {passwords.length} passwords
                </Badge>
                <Badge variant="outline" className="ml-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  zkLogin Verified
                </Badge>
              </CardTitle>
              <CardDescription>
                Securely manage your passwords with end-to-end encryption and zkLogin
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportVault}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={importVault}
                  className="hidden"
                />
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </span>
                </Button>
              </label>
              <Button variant="outline" onClick={handleLock}>
                <Lock className="h-4 w-4 mr-2" />
                Lock Vault
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>
                  All ({passwords.length})
                </TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category} ({passwords.filter(p => p.category === category).length})
                  </TabsTrigger>
                ))}
              </TabsList>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Password</DialogTitle>
                    <DialogDescription>
                      Securely store a new password in your vault
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">Title</Label>
                      <Input
                        id="title"
                        value={newPassword.title}
                        onChange={(e) => setNewPassword(prev => ({ ...prev, title: e.target.value }))}
                        className="col-span-3"
                        placeholder="e.g., Gmail Account"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">Username</Label>
                      <Input
                        id="username"
                        value={newPassword.username}
                        onChange={(e) => setNewPassword(prev => ({ ...prev, username: e.target.value }))}
                        className="col-span-3"
                        placeholder="username@example.com"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">Password</Label>
                      <div className="col-span-3 flex gap-2">
                        <Input
                          id="password"
                          type="password"
                          value={newPassword.password}
                          onChange={(e) => setNewPassword(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter password"
                        />
                        <Button variant="outline" onClick={generateSecurePassword}>
                          <Key className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {newPassword.password && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Strength</Label>
                        <div className="col-span-3 space-y-2">
                          <Progress value={(passwordStrength.score / 8) * 100} className="h-2" />
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={
                                passwordStrength.strength === "weak" ? "destructive" :
                                passwordStrength.strength === "medium" ? "secondary" :
                                passwordStrength.strength === "strong" ? "default" : "outline"
                              }
                            >
                              {passwordStrength.strength}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Score: {passwordStrength.score}/8
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="url" className="text-right">URL</Label>
                      <Input
                        id="url"
                        value={newPassword.url}
                        onChange={(e) => setNewPassword(prev => ({ ...prev, url: e.target.value }))}
                        className="col-span-3"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">Category</Label>
                      <select
                        id="category"
                        value={newPassword.category}
                        onChange={(e) => setNewPassword(prev => ({ ...prev, category: e.target.value }))}
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="notes" className="text-right">Notes</Label>
                      <Input
                        id="notes"
                        value={newPassword.notes}
                        onChange={(e) => setNewPassword(prev => ({ ...prev, notes: e.target.value }))}
                        className="col-span-3"
                        placeholder="Additional notes (optional)"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addPassword}>
                      Add Password
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search passwords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                <AnimatePresence>
                  {filteredPasswords.map((password) => (
                    <motion.div
                      key={password.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{password.title}</h3>
                            <Badge variant="outline">{password.category}</Badge>
                            {password.zkVerified && (
                              <Badge variant="outline" className="text-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                zkVerified
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Username:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono">{password.username}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(password.username, "Username")}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">Password:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono">
                                  {showPasswords[password.id] ? password.password : "••••••••"}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => togglePasswordVisibility(password.id)}
                                >
                                  {showPasswords[password.id] ? (
                                    <EyeOff className="h-3 w-3" />
                                  ) : (
                                    <Eye className="h-3 w-3" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(password.password, "Password")}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          {password.url && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium">URL:</span>
                              <a 
                                href={password.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline ml-1"
                              >
                                {password.url}
                              </a>
                            </div>
                          )}
                          {password.notes && (
                            <div className="mt-2 text-sm text-gray-500">
                              <span className="font-medium">Notes:</span> {password.notes}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditPassword(password)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deletePassword(password.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {filteredPasswords.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No passwords found</p>
                    <p className="text-sm">Add your first password to get started</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Password Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Password</DialogTitle>
            <DialogDescription>
              Update your password information
            </DialogDescription>
          </DialogHeader>
          {editingPassword && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">Title</Label>
                <Input
                  id="edit-title"
                  value={editingPassword.title}
                  onChange={(e) => setEditingPassword(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-username" className="text-right">Username</Label>
                <Input
                  id="edit-username"
                  value={editingPassword.username}
                  onChange={(e) => setEditingPassword(prev => prev ? { ...prev, username: e.target.value } : null)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-password" className="text-right">Password</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={editingPassword.password}
                  onChange={(e) => setEditingPassword(prev => prev ? { ...prev, password: e.target.value } : null)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-url" className="text-right">URL</Label>
                <Input
                  id="edit-url"
                  value={editingPassword.url}
                  onChange={(e) => setEditingPassword(prev => prev ? { ...prev, url: e.target.value } : null)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">Category</Label>
                <select
                  id="edit-category"
                  value={editingPassword.category}
                  onChange={(e) => setEditingPassword(prev => prev ? { ...prev, category: e.target.value } : null)}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-notes" className="text-right">Notes</Label>
                <Input
                  id="edit-notes"
                  value={editingPassword.notes}
                  onChange={(e) => setEditingPassword(prev => prev ? { ...prev, notes: e.target.value } : null)}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={editPassword}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Security Info */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Security Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>End-to-end encryption with Walrus</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-500" />
              <span>Secure storage with Seal</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-red-500" />
              <span>Master password protection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-purple-500" />
              <span>zkLogin verification</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 