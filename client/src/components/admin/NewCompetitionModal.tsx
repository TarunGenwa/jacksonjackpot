'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Save,
  AlertTriangle,
  Check,
  Trophy
} from 'lucide-react';
import { adminApi } from '@/services/adminApi';
import { CompetitionCreateData } from '@/types/admin';

interface Charity {
  id: string;
  name: string;
  isVerified: boolean;
  isActive: boolean;
  logoUrl?: string;
}

interface NewCompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewCompetitionModal({
  isOpen,
  onClose,
  onSuccess,
}: NewCompetitionModalProps) {
  const [formData, setFormData] = useState<CompetitionCreateData>({
    title: '',
    description: '',
    imageUrl: '',
    ticketPrice: 500, // £5.00 in pence
    maxTickets: 1000,
    startDate: '',
    endDate: '',
    drawDate: '',
    charityId: '',
    status: 'DRAFT',
  });

  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(false);
  const [charityLoading, setCharityLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdCompetitionId, setCreatedCompetitionId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch charities when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCharities();
      // Reset form when modal opens
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        ticketPrice: 500,
        maxTickets: 1000,
        startDate: '',
        endDate: '',
        drawDate: '',
        charityId: '',
        status: 'DRAFT',
      });
      setErrors({});
      setCreatedCompetitionId(null);
      setShowSuccess(false);
    }
  }, [isOpen]);

  const fetchCharities = async () => {
    try {
      setCharityLoading(true);
      const response = await adminApi.getCharities({
        limit: 100,
        isVerified: 'true',
        isActive: 'true',
      }) as { charities: Charity[] };
      setCharities(response.charities);
    } catch (err) {
      console.error('Failed to fetch charities:', err);
    } finally {
      setCharityLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.charityId) {
      newErrors.charityId = 'Please select a charity';
    }

    if (formData.ticketPrice <= 0) {
      newErrors.ticketPrice = 'Ticket price must be greater than 0';
    }

    if (formData.maxTickets <= 0) {
      newErrors.maxTickets = 'Max tickets must be greater than 0';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!formData.drawDate) {
      newErrors.drawDate = 'Draw date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Convert date strings to ISO format
      const formattedData = {
        ...formData,
        startDate: new Date(formData.startDate + 'T00:00:00Z').toISOString(),
        endDate: new Date(formData.endDate + 'T23:59:59Z').toISOString(),
        drawDate: new Date(formData.drawDate + 'T12:00:00Z').toISOString(),
      };

      const result = await adminApi.createCompetition(formattedData);
      setCreatedCompetitionId(result.id);
      setShowSuccess(true);
      onSuccess();
    } catch (err) {
      console.error('Failed to create competition:', err);
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to create competition' });
    } finally {
      setLoading(false);
    }
  };

  const selectedCharity = charities.find(c => c.id === formData.charityId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {showSuccess ? 'Competition Created!' : 'Create New Competition'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Success Content */}
          {showSuccess && createdCompetitionId ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Competition Created Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Your competition "{formData.title}" has been created and is ready for configuration.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <a
                  href={`/admin/competitions/${createdCompetitionId}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  onClick={onClose}
                >
                  <Trophy className="h-4 w-4" />
                  Add Prizes
                </a>
              </div>
            </div>
          ) : (
            /* Form Content */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <Image
                      src={formData.imageUrl}
                      alt="Competition preview"
                      width={400}
                      height={128}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Charity
                </label>
                {charityLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <select
                    value={formData.charityId}
                    onChange={(e) => setFormData({ ...formData, charityId: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a charity...</option>
                    {charities.map((charity) => (
                      <option key={charity.id} value={charity.id}>
                        {charity.name} {charity.isVerified ? '✓' : ''}
                      </option>
                    ))}
                  </select>
                )}
                {errors.charityId && (
                  <p className="text-red-500 text-sm mt-1">{errors.charityId}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="UPCOMING">Upcoming</option>
                    <option value="ACTIVE">Active</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket Price (£)
                  </label>
                  <input
                    type="number"
                    value={formData.ticketPrice / 100}
                    onChange={(e) => setFormData({ ...formData, ticketPrice: parseFloat(e.target.value) * 100 })}
                    step="0.01"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.ticketPrice && (
                    <p className="text-red-500 text-sm mt-1">{errors.ticketPrice}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Tickets
                </label>
                <input
                  type="number"
                  value={formData.maxTickets}
                  onChange={(e) => setFormData({ ...formData, maxTickets: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.maxTickets && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxTickets}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Draw Date
                  </label>
                  <input
                    type="date"
                    value={formData.drawDate}
                    onChange={(e) => setFormData({ ...formData, drawDate: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.drawDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.drawDate}</p>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700">{errors.submit}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {loading ? 'Creating...' : 'Create Competition'}
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}