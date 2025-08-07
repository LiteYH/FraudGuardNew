# FraudGuard - AI-Powered Password Manager with zkLogin Security

A secure, privacy-preserving password manager built with React, TypeScript, and zkLogin technology for enhanced security.

## 🚀 Features

### ✅ **Password Management**
- **Secure Storage**: End-to-end encryption with AES-256-GCM
- **Master Password**: 3-character minimum requirement for easy access
- **Password Categories**: Organize passwords by type (Personal, Work, Banking, etc.)
- **Password Strength**: Built-in password strength checker
- **Secure Generation**: Generate strong passwords automatically

### ✅ **Core Functionality (All Working!)**
- **✅ Export Passwords**: Download vault as JSON file
- **✅ Import Passwords**: Import from JSON backup files
- **✅ Edit Passwords**: Modify existing password entries
- **✅ Add Passwords**: Create new password entries
- **✅ Delete Passwords**: Remove password entries
- **✅ Persistence**: All changes saved to localStorage
- **✅ Master Password**: Change master password functionality

### 🔐 **Security Features**
- **zkLogin Integration**: Blockchain-based authentication
- **Walrus & Seal Encryption**: Advanced encryption algorithms
- **Local Storage**: Passwords stored locally, not on servers
- **Zero-Knowledge Proofs**: Enhanced security with zkLogin

### 🎨 **User Interface**
- **Modern UI**: Built with Shadcn UI components
- **Dark Theme**: Cyberpunk-inspired design
- **Responsive**: Works on desktop and mobile
- **Intuitive**: Easy-to-use interface

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Shadcn UI + Tailwind CSS
- **Build Tool**: Vite
- **Encryption**: CryptoJS + Custom Walrus & Seal
- **Blockchain**: Sui zkLogin
- **State Management**: React Hooks
- **Routing**: React Router DOM

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/LiteYH/FraudGuardNew.git
   cd FraudGuardNew
   ```

2. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   ```
   http://localhost:8080
   ```

## 🎯 Usage

### **Getting Started**
1. **Connect Wallet**: Use zkLogin wallet for authentication
2. **Set Master Password**: Enter a password (minimum 3 characters)
3. **Unlock Vault**: Access your password manager

### **Managing Passwords**
- **Add Password**: Click "+ Add Password" button
- **Edit Password**: Click pencil icon on any password entry
- **Delete Password**: Click trash icon on any password entry
- **Export Vault**: Click "Export" button to download backup
- **Import Vault**: Click "Import" button to restore from backup

### **Security Features**
- **Change Master Password**: Go to Profile → Security Settings
- **Lock Vault**: Click "Lock Vault" to secure your data
- **Password Strength**: Check password strength in real-time

## 🔧 Recent Fixes

### **✅ Master Password**
- **Fixed**: Changed from 8-character to 3-character minimum
- **Result**: Easy access while maintaining security

### **✅ Export Functionality**
- **Fixed**: Implemented reliable Blob-based export
- **Result**: Downloads JSON file immediately

### **✅ Edit Functionality**
- **Fixed**: Deep copy implementation for password editing
- **Result**: Edit dialog opens and saves correctly

### **✅ Add/Delete Functionality**
- **Fixed**: Simplified localStorage persistence logic
- **Result**: Changes persist after refresh

### **✅ Persistence Issues**
- **Fixed**: Optimized useEffect dependencies
- **Result**: All changes saved automatically

## 📁 Project Structure

```
FraudGuard/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── PasswordManager.tsx  # Main password manager
│   │   │   └── ui/          # Shadcn UI components
│   │   ├── pages/           # Page components
│   │   ├── lib/             # Utilities and libraries
│   │   │   └── walrus-seal.ts  # Encryption utilities
│   │   └── contexts/        # React contexts
│   ├── public/              # Static assets
│   └── package.json         # Dependencies
├── backend/                 # Backend API (if needed)
├── sui/                     # Sui blockchain contracts
└── README.md               # This file
```

## 🔐 Security Architecture

### **Encryption Flow**
1. **Master Password** + **Wallet Address** → **Derived Key**
2. **Password Data** + **Derived Key** → **AES-256 Encrypted**
3. **Local Storage** → **Encrypted Data Only**

### **zkLogin Integration**
- **Authentication**: Wallet-based login
- **Zero-Knowledge**: Privacy-preserving proofs
- **Blockchain**: Sui network integration

## 🚀 Deployment

### **Development**
```bash
cd frontend
npm run dev
```

### **Production Build**
```bash
cd frontend
npm run build
```

### **Preview Build**
```bash
cd frontend
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify all dependencies are installed
3. Clear browser cache and localStorage
4. Open an issue on GitHub

## 🎉 Acknowledgments

- **Shadcn UI** for beautiful components
- **Sui Foundation** for zkLogin technology
- **CryptoJS** for encryption utilities
- **React Team** for the amazing framework

---

**FraudGuard** - Secure password management with AI-powered protection and zkLogin security.

