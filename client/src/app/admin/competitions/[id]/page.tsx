'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { adminApi } from '@/services/adminApi';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import ErrorAlert from '@/components/admin/ErrorAlert';
import DrawManagement from '@/components/admin/DrawManagement';
import PrizeManagement from '@/components/admin/PrizeManagement';

interface CompetitionDetail {
  id: string;
  title: string;
  description: string;
  status: string;
  ticketPrice: number;
  maxTickets: number;
  ticketsSold: number;
  startDate: string;
  endDate: string;
  drawDate: string;
  createdAt: string;
  charity: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  prizes: Array<{
    id: string;
    name: string;
    description: string;
    value: number;
    type: 'DRAW' | 'INSTANT_WIN';
    position?: number;
    quantity: number;
    allocatedTickets?: number;
  }>;
  tickets: Array<{
    id: string;
    ticketNumber: string;
    purchasePrice: number;
    status: string;
    purchasedAt: string;
    user: {
      id: string;
      username: string;
      email: string;
    };
  }>;
  winners: Array<{
    id: string;
    status: string;
    claimedAt?: string;
    paidOutAt?: string;
    user: {
      id: string;
      username: string;
      email: string;
    };
    prize: {
      name: string;
      value: number;
    };
    ticket: {
      ticketNumber: string;
    };
  }>;
}

export default function CompetitionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const competitionId = params.id as string;

  const [competition, setCompetition] = useState<CompetitionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'DRAFT' as string,
    ticketPrice: 0,
    maxTickets: 0,
    startDate: '',
    endDate: '',
    drawDate: '',
  });

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        setLoading(true);
        setError(null);
        const competitionData = await adminApi.getCompetitionById(competitionId) as CompetitionDetail;
        setCompetition(competitionData);
        setFormData({
          title: competitionData.title,
          description: competitionData.description,
          status: competitionData.status,
          ticketPrice: competitionData.ticketPrice,
          maxTickets: competitionData.maxTickets,
          startDate: competitionData.startDate.split('T')[0],
          endDate: competitionData.endDate.split('T')[0],
          drawDate: competitionData.drawDate.split('T')[0],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load competition');
      } finally {
        setLoading(false);
      }
    };

    if (competitionId) {
      fetchCompetition();
    }
  }, [competitionId, refreshKey]);

  const handleSave = async () => {
    try {
      // Convert date strings to ISO DateTime format
      const formatDateToISO = (dateString: string) => {
        return new Date(dateString + 'T00:00:00.000Z').toISOString();
      };

      await adminApi.updateCompetition(competitionId, {
        ...formData,
        ticketPrice: Number(formData.ticketPrice),
        maxTickets: Number(formData.maxTickets),
        startDate: formatDateToISO(formData.startDate),
        endDate: formatDateToISO(formData.endDate),
        drawDate: formatDateToISO(formData.drawDate),
      });
      setEditing(false);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update competition');
    }
  };

  const handleCancel = () => {
    if (competition) {
      setFormData({
        title: competition.title,
        description: competition.description,
        status: competition.status,
        ticketPrice: competition.ticketPrice,
        maxTickets: competition.maxTickets,
        startDate: competition.startDate.split('T')[0],
        endDate: competition.endDate.split('T')[0],
        drawDate: competition.drawDate.split('T')[0],
      });
    }
    setEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'UPCOMING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'SOLD_OUT': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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

  if (!competition) {
    return <ErrorAlert message="Competition not found" />;
  }

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
            <h1 className="text-3xl font-bold text-gray-800">Competition Details</h1>
            <p className="text-gray-600 mt-1">View and manage competition information</p>
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
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit2 className="h-4 w-4" />
              Edit Competition
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Competition Information</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{competition.title}</p>
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
                  <p className="text-gray-900">{competition.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  {editing ? (
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="UPCOMING">Upcoming</option>
                      <option value="ACTIVE">Active</option>
                      <option value="SOLD_OUT">Sold Out</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(competition.status)}`}>
                      {competition.status}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Charity
                  </label>
                  <p className="text-gray-900">{competition.charity.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket Price
                  </label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.ticketPrice}
                      onChange={(e) => setFormData({ ...formData, ticketPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">£{(competition.ticketPrice / 100).toFixed(2)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Tickets
                  </label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.maxTickets}
                      onChange={(e) => setFormData({ ...formData, maxTickets: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{competition.maxTickets}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  {editing ? (
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{new Date(competition.startDate).toLocaleDateString()}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  {editing ? (
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{new Date(competition.endDate).toLocaleDateString()}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Draw Date
                  </label>
                  {editing ? (
                    <input
                      type="date"
                      value={formData.drawDate}
                      onChange={(e) => setFormData({ ...formData, drawDate: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{new Date(competition.drawDate).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Prize Management */}
          <PrizeManagement
            competitionId={competition.id}
            prizes={competition.prizes}
            onPrizeUpdate={() => setRefreshKey(prev => prev + 1)}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tickets Sold:</span>
                <span className="font-medium">{competition.ticketsSold}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue:</span>
                <span className="font-medium">£{((competition.ticketsSold * competition.ticketPrice) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Winners:</span>
                <span className="font-medium">{competition.winners.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(competition.ticketsSold / competition.maxTickets) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                {Math.round((competition.ticketsSold / competition.maxTickets) * 100)}% sold
              </p>
            </div>
          </div>

          {/* Recent Tickets */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Tickets</h3>
            <div className="space-y-3">
              {competition.tickets.slice(0, 5).map((ticket) => (
                <div key={ticket.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">#{ticket.ticketNumber}</p>
                    <p className="text-xs text-gray-600">{ticket.user.username}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">£{(ticket.purchasePrice / 100).toFixed(2)}</p>
                    <p className="text-xs text-gray-600">{new Date(ticket.purchasedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {competition.tickets.length === 0 && (
                <p className="text-gray-500 text-center py-4">No tickets sold yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Draw Management Section */}
      <div className="mt-8">
        <DrawManagement
          competitionId={competition.id}
          competitionStatus={competition.status}
          drawDate={competition.drawDate}
          onStatusUpdate={() => setRefreshKey(prev => prev + 1)}
        />
      </div>
    </div>
  );
}