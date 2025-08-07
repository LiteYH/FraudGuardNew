import React from 'react';
import { CyberNavigation } from '@/components/CyberNavigation';
import { DashboardHero } from '@/components/DashboardHero';
import { FraudDetectionWidget } from '@/components/FraudDetectionWidget';
import { FraudAlert } from '@/components/FraudAlert';
import { NftCard } from '@/components/NftCard';
import { FloatingWarningIcon } from '@/components/FloatingWarningIcon';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative">
      {/* Floating warning icon */}
      <FloatingWarningIcon />
      
      {/* Navigation */}
      <CyberNavigation />
      
      {/* Main Content Container */}
      <div className="relative z-10 pt-20">
        {/* Dashboard Hero Section */}
        <section className="w-full">
          <DashboardHero />
        </section>
        
        {/* Quick Actions Section */}
        <section className="w-full px-6 py-4">
          <div className="container mx-auto">
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate('/passwords')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Access Password Manager
              </Button>
            </div>
          </div>
        </section>
        
        {/* Fraud Detection Widget Section */}
        <section className="w-full px-6 py-8">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6 neon-text">
              Fraud Detection Stats
            </h2>
            <FraudDetectionWidget />
          </div>
        </section>
        
        {/* Active Alerts Section */}
        <section className="w-full px-6 py-8">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6 neon-text">
              Active Alerts
            </h2>
            <div className="space-y-4">
              <FraudAlert 
                severity="critical"
                title="Plagiarism Detected"
                description="NFT #3847 contains copyrighted content from verified artist 'CyberVision'"
                timestamp="2 minutes ago"
                nftId="3847"
              />
              <FraudAlert 
                severity="high"
                title="Suspicious Activity"
                description="Multiple accounts created from same IP attempting rapid NFT creation"
                timestamp="15 minutes ago"
              />
              <FraudAlert 
                severity="medium"
                title="Price Manipulation Alert"
                description="Unusual bidding pattern detected on NFT #2156"
                timestamp="1 hour ago"
                nftId="2156"
              />
            </div>
          </div>
        </section>
        
        {/* Protected Marketplace Section */}
        <section className="w-full px-6 py-8">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6 neon-text">
              Protected Marketplace
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <NftCard 
                id="1"
                title="Cyber Robot #001"
                image="/api/placeholder/300/200"
                price="2.5 ETH"
                creator="CyberArtist"
                threatLevel="safe"
              />
              <NftCard 
                id="2"
                title="Digital Interface"
                image="/api/placeholder/300/200"
                price="1.8 ETH"
                creator="TechCreator"
                threatLevel="warning"
              />
              <NftCard 
                id="3"
                title="Glitch World"
                image="/api/placeholder/300/200"
                price="3.2 ETH"
                creator="GlitchMaster"
                threatLevel="danger"
                flagged={true}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard; 