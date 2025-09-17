'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Trophy,
  Heart,
  TrendingUp,
  Activity,
  DollarSign,
  Award,
  UserCheck
} from 'lucide-react';

interface Statistics {
  users: {
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
    recentUsers: number;
  };
  competitions: {
    totalCompetitions: number;
    activeCompetitions: number;
    completedCompetitions: number;
    totalTicketsSold: number;
  };
  charities: {
    totalCharities: number;
    verifiedCharities: number;
    activeCharities: number;
    totalDonationAmount: number;
  };
}

export default function AdminDashboard() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [usersRes, competitionsRes, charitiesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/statistics`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/competitions/statistics`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/charities/statistics`, { headers })
      ]);

      if (!usersRes.ok || !competitionsRes.ok || !charitiesRes.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const [users, competitions, charities] = await Promise.all([
        usersRes.json(),
        competitionsRes.json(),
        charitiesRes.json()
      ]);

      setStatistics({ users, competitions, charities });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading statistics: {error}</p>
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  const statCards = [
    {
      title: 'Total Users',
      value: statistics.users.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: `${statistics.users.recentUsers} new this week`
    },
    {
      title: 'Active Users',
      value: statistics.users.activeUsers,
      icon: UserCheck,
      color: 'bg-green-500',
      change: `${Math.round((statistics.users.activeUsers / statistics.users.totalUsers) * 100)}% of total`
    },
    {
      title: 'Active Competitions',
      value: statistics.competitions.activeCompetitions,
      icon: Trophy,
      color: 'bg-purple-500',
      change: `${statistics.competitions.totalCompetitions} total`
    },
    {
      title: 'Tickets Sold',
      value: statistics.competitions.totalTicketsSold,
      icon: Award,
      color: 'bg-yellow-500',
      change: 'All time'
    },
    {
      title: 'Total Charities',
      value: statistics.charities.totalCharities,
      icon: Heart,
      color: 'bg-pink-500',
      change: `${statistics.charities.verifiedCharities} verified`
    },
    {
      title: 'Total Donations',
      value: `£${(statistics.charities.totalDonationAmount / 100).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-indigo-500',
      change: 'All time'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin panel</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Activity className="h-4 w-4 mr-1" />
                <span>{stat.change}</span>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/users"
            className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-800">Manage Users</p>
              <p className="text-sm text-gray-500">View and manage user accounts</p>
            </div>
          </a>
          <a
            href="/admin/competitions"
            className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Trophy className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-800">Competitions</p>
              <p className="text-sm text-gray-500">Manage lottery competitions</p>
            </div>
          </a>
          <a
            href="/admin/charities"
            className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Heart className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-800">Charities</p>
              <p className="text-sm text-gray-500">Manage charity organizations</p>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-3">User Distribution</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="text-sm font-medium">{statistics.users.activeUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Admin Users</span>
                <span className="text-sm font-medium">{statistics.users.adminUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New This Week</span>
                <span className="text-sm font-medium">{statistics.users.recentUsers}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-3">Competition Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active</span>
                <span className="text-sm font-medium">{statistics.competitions.activeCompetitions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-sm font-medium">{statistics.competitions.completedCompetitions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total</span>
                <span className="text-sm font-medium">{statistics.competitions.totalCompetitions}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}