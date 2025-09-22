'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Trophy, Gift } from 'lucide-react';
import { adminApi } from '@/services/adminApi';

interface Prize {
  id: string;
  name: string;
  description: string;
  value: number;
  position: number;
  quantity: number;
}

interface PrizeManagementProps {
  competitionId: string;
  prizes: Prize[];
  onPrizeUpdate: () => void;
}

export default function PrizeManagement({
  competitionId,
  prizes: initialPrizes,
  onPrizeUpdate
}: PrizeManagementProps) {
  const [prizes, setPrizes] = useState<Prize[]>(initialPrizes);
  const [isAddingPrize, setIsAddingPrize] = useState(false);
  const [editingPrizeId, setEditingPrizeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newPrize, setNewPrize] = useState({
    name: '',
    description: '',
    value: 0,
    position: 1,
    quantity: 1
  });

  const [editPrize, setEditPrize] = useState({
    name: '',
    description: '',
    value: 0,
    position: 1,
    quantity: 1
  });

  useEffect(() => {
    setPrizes(initialPrizes);
  }, [initialPrizes]);

  const handleAddPrize = async () => {
    try {
      setLoading(true);
      setError(null);

      // Convert value from pounds to pence for backend
      const prizeData = {
        ...newPrize,
        value: Math.round(newPrize.value * 100)
      };

      await adminApi.createPrize(competitionId, prizeData);

      // Reset form
      setNewPrize({
        name: '',
        description: '',
        value: 0,
        position: 1,
        quantity: 1
      });
      setIsAddingPrize(false);

      // Refresh prizes
      onPrizeUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add prize');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePrize = async (prizeId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Convert value from pounds to pence for backend
      const prizeData = {
        ...editPrize,
        value: Math.round(editPrize.value * 100)
      };

      await adminApi.updatePrize(competitionId, prizeId, prizeData);

      setEditingPrizeId(null);

      // Refresh prizes
      onPrizeUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update prize');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrize = async (prizeId: string) => {
    if (!confirm('Are you sure you want to delete this prize?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await adminApi.deletePrize(competitionId, prizeId);

      // Refresh prizes
      onPrizeUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete prize');
    } finally {
      setLoading(false);
    }
  };

  const startEditPrize = (prize: Prize) => {
    setEditingPrizeId(prize.id);
    setEditPrize({
      name: prize.name,
      description: prize.description,
      value: prize.value / 100, // Convert from pence to pounds for display
      position: prize.position,
      quantity: prize.quantity
    });
  };

  const cancelEdit = () => {
    setEditingPrizeId(null);
    setEditPrize({
      name: '',
      description: '',
      value: 0,
      position: 1,
      quantity: 1
    });
  };

  const cancelAdd = () => {
    setIsAddingPrize(false);
    setNewPrize({
      name: '',
      description: '',
      value: 0,
      position: 1,
      quantity: 1
    });
  };

  const getNextPosition = () => {
    if (prizes.length === 0) return 1;
    return Math.max(...prizes.map(p => p.position)) + 1;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-800">Prize Management</h2>
        </div>
        {!isAddingPrize && (
          <button
            onClick={() => {
              setIsAddingPrize(true);
              setNewPrize({
                ...newPrize,
                position: getNextPosition()
              });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Prize
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Add Prize Form */}
        {isAddingPrize && (
          <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
            <h3 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Add New Prize
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prize Name *
                </label>
                <input
                  type="text"
                  value={newPrize.name}
                  onChange={(e) => setNewPrize({ ...newPrize, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., First Prize"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value (£) *
                </label>
                <input
                  type="number"
                  value={newPrize.value}
                  onChange={(e) => setNewPrize({ ...newPrize, value: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position *
                </label>
                <input
                  type="number"
                  value={newPrize.position}
                  onChange={(e) => setNewPrize({ ...newPrize, position: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={newPrize.quantity}
                  onChange={(e) => setNewPrize({ ...newPrize, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  disabled={loading}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newPrize.description}
                  onChange={(e) => setNewPrize({ ...newPrize, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Prize description..."
                  disabled={loading}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={cancelAdd}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </button>
              <button
                onClick={handleAddPrize}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                disabled={loading || !newPrize.name || newPrize.value <= 0}
              >
                <Save className="h-4 w-4" />
                Add Prize
              </button>
            </div>
          </div>
        )}

        {/* Prize List */}
        {prizes.length > 0 ? (
          <div className="space-y-3">
            {prizes.map((prize) => (
              <div
                key={prize.id}
                className={`border rounded-lg p-4 ${
                  prize.position === 1 ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
                }`}
              >
                {editingPrizeId === prize.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prize Name
                        </label>
                        <input
                          type="text"
                          value={editPrize.name}
                          onChange={(e) => setEditPrize({ ...editPrize, name: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Value (£)
                        </label>
                        <input
                          type="number"
                          value={editPrize.value}
                          onChange={(e) => setEditPrize({ ...editPrize, value: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          step="0.01"
                          min="0"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Position
                        </label>
                        <input
                          type="number"
                          value={editPrize.position}
                          onChange={(e) => setEditPrize({ ...editPrize, position: parseInt(e.target.value) || 1 })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          value={editPrize.quantity}
                          onChange={(e) => setEditPrize({ ...editPrize, quantity: parseInt(e.target.value) || 1 })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                          disabled={loading}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={editPrize.description}
                          onChange={(e) => setEditPrize({ ...editPrize, description: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={2}
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdatePrize(prize.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        disabled={loading || !editPrize.name || editPrize.value <= 0}
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {prize.position === 1 && (
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        )}
                        <h4 className="font-semibold text-gray-900">
                          Position {prize.position}: {prize.name}
                        </h4>
                      </div>
                      {prize.description && (
                        <p className="text-sm text-gray-600 mb-2">{prize.description}</p>
                      )}
                      <div className="flex gap-4 text-sm">
                        <span className="font-medium text-green-600">
                          £{(prize.value / 100).toFixed(2)}
                        </span>
                        {prize.quantity > 1 && (
                          <span className="text-gray-600">
                            Quantity: {prize.quantity}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditPrize(prize)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        disabled={loading}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePrize(prize.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No prizes configured yet</p>
            <p className="text-sm mt-1">Add prizes to make this competition more exciting!</p>
          </div>
        )}

        {/* Total Prize Value */}
        {prizes.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total Prize Value:</span>
              <span className="text-lg font-bold text-green-600">
                £{(prizes.reduce((sum, p) => sum + (p.value * p.quantity), 0) / 100).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}