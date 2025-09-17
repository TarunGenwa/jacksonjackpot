'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Heart,
  Mail,
  Globe,
  Building,
  Shield,
  Calendar,
  Edit2,
  Save,
  X,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { adminApi } from '@/services/adminApi';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import ErrorAlert from '@/components/admin/ErrorAlert';

interface CharityDetail {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  website?: string;
  email: string;
  taxId?: string;
  isVerified: boolean;
  isActive: boolean;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankSortCode?: string;
  createdAt: string;
  updatedAt: string;
  competitions: Array<{
    id: string;
    title: string;
    status: string;
    ticketsSold: number;
    maxTickets: number;
    ticketPrice: number;
  }>;
  donations: Array<{
    id: string;
    amount: number;
    donorName?: string;
    donorEmail?: string;
    isAnonymous: boolean;
    createdAt: string;
  }>;
}

export default function CharityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const charityId = params.id as string;

  const [charity, setCharity] = useState<CharityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logoUrl: '',
    website: '',
    email: '',
    taxId: '',
    isActive: true,
    bankAccountName: '',
    bankAccountNumber: '',
    bankSortCode: '',
  });

  useEffect(() => {
    if (charityId) {
      fetchCharity();
    }
  }, [charityId]);

  const fetchCharity = async () => {
    try {
      setLoading(true);
      setError(null);
      const charityData = await adminApi.getCharityById(charityId);
      setCharity(charityData);
      setFormData({
        name: charityData.name,
        description: charityData.description,
        logoUrl: charityData.logoUrl || '',
        website: charityData.website || '',
        email: charityData.email,
        taxId: charityData.taxId || '',
        isActive: charityData.isActive,
        bankAccountName: charityData.bankAccountName || '',
        bankAccountNumber: charityData.bankAccountNumber || '',
        bankSortCode: charityData.bankSortCode || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load charity');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await adminApi.updateCharity(charityId, formData);
      setEditing(false);
      await fetchCharity();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update charity');
    }
  };

  const handleCancel = () => {
    if (charity) {
      setFormData({
        name: charity.name,
        description: charity.description,
        logoUrl: charity.logoUrl || '',
        website: charity.website || '',
        email: charity.email,
        taxId: charity.taxId || '',
        isActive: charity.isActive,
        bankAccountName: charity.bankAccountName || '',
        bankAccountNumber: charity.bankAccountNumber || '',
        bankSortCode: charity.bankSortCode || '',
      });
    }
    setEditing(false);
  };

  const handleVerificationToggle = async () => {
    try {
      await adminApi.updateCharityVerification(charityId, !charity?.isVerified);
      await fetchCharity();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update verification status');
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} onClose={() => setError(null)} />;
  }

  if (!charity) {
    return <ErrorAlert message="Charity not found" />;
  }

  const totalDonations = charity.donations.reduce((sum, donation) => sum + donation.amount, 0);
  const totalCompetitions = charity.competitions.length;
  const activeCompetitions = charity.competitions.filter(comp => comp.status === 'ACTIVE').length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Charity Details</h1>
            <p className="text-gray-600 mt-1">View and manage charity information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleVerificationToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  charity.isVerified
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {charity.isVerified ? (
                  <>
                    <XCircle className="h-4 w-4" />
                    Unverify
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Verify
                  </>
                )}
              </button>
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit2 className="h-4 w-4" />
                Edit Charity
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Charity Information</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{charity.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                {editing ? (
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{charity.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{charity.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  {editing ? (
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{charity.website || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax ID
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.taxId}
                      onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{charity.taxId || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  {editing ? (
                    <select
                      value={formData.isActive.toString()}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      charity.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {charity.isActive ? 'Active' : 'Inactive'}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm font-medium text-gray-700">Verification Status:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    charity.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {charity.isVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.bankAccountName}
                    onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{charity.bankAccountName || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.bankAccountNumber}
                    onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{charity.bankAccountNumber || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Code
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.bankSortCode}
                    onChange={(e) => setFormData({ ...formData, bankSortCode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{charity.bankSortCode || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Competitions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Competitions</h3>
            <div className="space-y-4">
              {charity.competitions.map((competition) => (
                <div key={competition.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{competition.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {competition.ticketsSold} / {competition.maxTickets} tickets sold
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        competition.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        competition.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {competition.status}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        £{(competition.ticketPrice / 100).toFixed(2)} per ticket
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {charity.competitions.length === 0 && (
                <p className="text-gray-500 text-center py-4">No competitions yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Donations:</span>
                <span className="font-medium">£{(totalDonations / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Competitions:</span>
                <span className="font-medium">{totalCompetitions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Competitions:</span>
                <span className="font-medium">{activeCompetitions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Donors:</span>
                <span className="font-medium">{charity.donations.length}</span>
              </div>
            </div>
          </div>

          {/* Recent Donations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Donations</h3>
            <div className="space-y-3">
              {charity.donations.slice(0, 5).map((donation) => (
                <div key={donation.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {donation.isAnonymous ? 'Anonymous' : donation.donorName || 'Anonymous'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">£{(donation.amount / 100).toFixed(2)}</p>
                  </div>
                </div>
              ))}
              {charity.donations.length === 0 && (
                <p className="text-gray-500 text-center py-4">No donations yet</p>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Information</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Created: {new Date(charity.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Updated: {new Date(charity.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}