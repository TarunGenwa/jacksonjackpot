'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Calendar,
  Users,
  Trophy,
  Plus,
  Ticket,
  X,
  Save,
  AlertTriangle,
  Image as ImageIcon,
  Eye
} from 'lucide-react';
import { adminApi } from '@/services/adminApi';
import { Prize } from '@/types/admin';

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

interface EditModalData {
  competition: Competition | null;
  isOpen: boolean;
}

interface DeleteModalData {
  competitionId: string | null;
  competitionTitle: string;
  isOpen: boolean;
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
  const [editModal, setEditModal] = useState<EditModalData>({ competition: null, isOpen: false });
  const [deleteModal, setDeleteModal] = useState<DeleteModalData>({ competitionId: null, competitionTitle: '', isOpen: false });
  const [editFormData, setEditFormData] = useState<Partial<Competition>>({});
  const [savingEdit, setSavingEdit] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
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

  const handleDeleteCompetition = async () => {
    if (!deleteModal.competitionId) return;

    try {
      await adminApi.deleteCompetition(deleteModal.competitionId);
      setDeleteModal({ competitionId: null, competitionTitle: '', isOpen: false });
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete competition');
    }
  };

  const openEditModal = (competition: Competition) => {
    setEditFormData({
      title: competition.title,
      description: competition.description,
      imageUrl: competition.imageUrl || '',
      status: competition.status,
      ticketPrice: competition.ticketPrice,
      maxTickets: competition.maxTickets,
      startDate: competition.startDate.split('T')[0],
      endDate: competition.endDate.split('T')[0],
      drawDate: competition.drawDate.split('T')[0]
    });
    setEditModal({ competition, isOpen: true });
  };

  const closeEditModal = () => {
    setEditModal({ competition: null, isOpen: false });
    setEditFormData({});
  };

  const handleSaveEdit = async () => {
    if (!editModal.competition) return;

    setSavingEdit(true);
    try {
      // Convert date strings to ISO-8601 format
      const formattedData = {
        ...editFormData,
        startDate: editFormData.startDate ? new Date(editFormData.startDate + 'T00:00:00Z').toISOString() : undefined,
        endDate: editFormData.endDate ? new Date(editFormData.endDate + 'T00:00:00Z').toISOString() : undefined,
        drawDate: editFormData.drawDate ? new Date(editFormData.drawDate + 'T00:00:00Z').toISOString() : undefined
      };

      await adminApi.updateCompetition(editModal.competition.id, formattedData);
      setRefreshKey(prev => prev + 1);
      closeEditModal();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update competition');
    } finally {
      setSavingEdit(false);
    }
  };

  const openDeleteModal = (competition: Competition) => {
    setDeleteModal({
      competitionId: competition.id,
      competitionTitle: competition.title,
      isOpen: true
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ competitionId: null, competitionTitle: '', isOpen: false });
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
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
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
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                <button
                  onClick={() => openEditModal(competition)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(competition)}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  title="Delete Competition"
                >
                  <Trash2 className="h-4 w-4" />
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

      {/* Edit Modal */}
      {editModal.isOpen && editModal.competition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Competition</h2>
                <button
                  onClick={closeEditModal}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editFormData.title || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editFormData.description || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={editFormData.imageUrl || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {editFormData.imageUrl && (
                    <div className="mt-2">
                      <Image
                        src={editFormData.imageUrl}
                        alt="Competition preview"
                        width={400}
                        height={128}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={editFormData.status || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="UPCOMING">Upcoming</option>
                      <option value="ACTIVE">Active</option>
                      <option value="SOLD_OUT">Sold Out</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ticket Price (£)
                    </label>
                    <input
                      type="number"
                      value={(editFormData.ticketPrice || 0) / 100}
                      onChange={(e) => setEditFormData({ ...editFormData, ticketPrice: parseFloat(e.target.value) * 100 })}
                      step="0.01"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Tickets
                  </label>
                  <input
                    type="number"
                    value={editFormData.maxTickets || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, maxTickets: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={editFormData.startDate || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={editFormData.endDate || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Draw Date
                    </label>
                    <input
                      type="date"
                      value={editFormData.drawDate || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, drawDate: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t">
                <button
                  onClick={handleSaveEdit}
                  disabled={savingEdit}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Competition
                  </h3>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700">
                  Are you sure you want to delete the competition
                  <span className="font-semibold">&ldquo;{deleteModal.competitionTitle}&rdquo;</span>?
                  This will permanently remove all associated data including tickets and winners.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCompetition}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Competition
                </button>
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}