'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Trophy,
  Plus,
  Ticket,
  Image as ImageIcon,
  Eye
} from 'lucide-react';
import { adminApi } from '@/services/adminApi';
import { Prize } from '@/types/admin';
import NewCompetitionModal from '@/components/admin/NewCompetitionModal';

interface Competition {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  status: string;
  ticketPrice: number;
  maxTickets: number;
  ticketsSold: number;
  startDate: string;
  endDate: string;
  drawDate: string;
  charity: {
    name: string;
    logoUrl?: string;
  };
  prizes: Prize[];
  _count: {
    tickets: number;
    winners: number;
  };
}



export default function CompetitionsManagement() {
  const router = useRouter();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCompetitions, setTotalCompetitions] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showNewCompetitionModal, setShowNewCompetitionModal] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await adminApi.getCompetitions({
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm || undefined,
          status: statusFilter || undefined,
        }) as { competitions: Competition[]; total: number };

        setCompetitions(data.competitions);
        setTotalCompetitions(data.total);
        setTotalPages(Math.ceil(data.total / itemsPerPage));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, [currentPage, searchTerm, statusFilter, refreshKey]);


  const handleNewCompetitionSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowNewCompetitionModal(false);
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

  if (loading && competitions.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Competition Management</h1>
          <p className="text-gray-600 mt-2">Manage lottery competitions</p>
        </div>
        <button
          onClick={() => setShowNewCompetitionModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Competition
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search competitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="ACTIVE">Active</option>
            <option value="SOLD_OUT">Sold Out</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <div className="flex items-center text-sm text-gray-600 md:col-span-2">
            <Filter className="h-4 w-4 mr-2" />
            <span>{totalCompetitions} total competitions</span>
          </div>
        </div>
      </div>

      {/* Competitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {competitions.map((competition) => (
          <div key={competition.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            {/* Competition Image */}
            <div className="relative w-full h-48 bg-gray-100 rounded-t-lg overflow-hidden">
              {competition.imageUrl ? (
                <Image
                  src={competition.imageUrl}
                  alt={competition.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-contain"
                  style={{ backgroundColor: '#f9fafb' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(competition.status)}`}>
                  {competition.status}
                </span>
              </div>
            </div>

            <div className="p-6 mt-1">
              {/* Header */}
              <div className="mb-4">
                <h3
                  className="text-lg font-semibold text-gray-900 mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => router.push(`/admin/competitions/${competition.id}`)}
                >
                  {competition.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {competition.charity.name}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                {competition.description}
              </p>

              {/* Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-600">
                    <Ticket className="h-4 w-4" />
                    Ticket Price
                  </span>
                  <span className="font-semibold text-gray-900">
                    £{(competition.ticketPrice / 100).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    Tickets Sold
                  </span>
                  <span className="font-semibold text-gray-900">
                    {competition.ticketsSold} / {competition.maxTickets}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(competition.ticketsSold / competition.maxTickets) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-600">
                    <Trophy className="h-4 w-4" />
                    Total Prizes
                  </span>
                  <span className="font-semibold text-gray-900">
                    {competition.prizes.length}
                  </span>
                </div>
              </div>

              {/* Dates */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span>Start: {new Date(competition.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span>End: {new Date(competition.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span>Draw: {new Date(competition.drawDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <button
                  onClick={() => router.push(`/admin/competitions/${competition.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg shadow-md px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, totalCompetitions)} of {totalCompetitions} competitions
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>



      {/* New Competition Modal */}
      <NewCompetitionModal
        isOpen={showNewCompetitionModal}
        onClose={() => setShowNewCompetitionModal(false)}
        onSuccess={handleNewCompetitionSuccess}
      />
    </div>
  );
}