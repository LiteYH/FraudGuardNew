import React from "react";
import { PasswordManager } from "@/components/PasswordManager";
import { CyberNavigation } from "@/components/CyberNavigation";

const PasswordManagerPage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <CyberNavigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
               Password Manager
            </h1>
            <p className="text-gray-400">
              Secure, privacy-preserving password storage powered by Walrus & Seal with zkLogin
            </p>
          </div>
          
          <PasswordManager />
        </div>
      </div>
    </div>
  );
};

export default PasswordManagerPage;
