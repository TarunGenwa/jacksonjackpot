'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';
import {
  Lock,
  Unlock,
  Play,
  Shield,
  AlertCircle,
  CheckCircle,
  Hash,
  Key,
  RefreshCw
} from 'lucide-react';

interface DrawStatus {
  competitionId: string;
  status: string;
  drawDate: string;
  seedStatus: string;
  seedCommitted: boolean;
  seedRevealed: boolean;
  statistics: {
    totalTickets: number;
    totalPrizes: number;
    winnersSelected: number;
  };
  winners?: Array<{
    winnerId: string;
    username: string;
    ticketNumber: string;
    prizeName: string;
    prizeValue: number;
    claimStatus: string;
    claimedAt?: string;
  }>;
}

interface DrawManagementProps {
  competitionId: string;
  competitionStatus: string;
  drawDate: string;
  onStatusUpdate?: () => void;
}

export default function DrawManagement({
  competitionId,
  competitionStatus,
  drawDate,
  onStatusUpdate
}: DrawManagementProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [drawStatus, setDrawStatus] = useState<DrawStatus | null>(null);
  const [seedInput, setSeedInput] = useState('');
  const [generatedSeed, setGeneratedSeed] = useState('');
  const [showSeedInput, setShowSeedInput] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  useEffect(() => {
    fetchDrawStatus();
  }, [competitionId]);

  const fetchDrawStatus = async () => {
    try {
      setLoading(true);
      const status = await adminApi.getDrawStatus(competitionId);
      setDrawStatus(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch draw status');
    } finally {
      setLoading(false);
    }
  };

  const generateRandomSeed = () => {
    const array = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    }
    const seed = Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    setGeneratedSeed(seed);
    setSeedInput(seed);
  };

  const handleCommitSeed = async () => {
    if (!seedInput) {
      setError('Please enter or generate a seed');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await adminApi.commitDrawSeed(competitionId, seedInput);
      setSuccess(`Seed committed successfully! Hash: ${result.commitHash.substring(0, 16)}...`);
      setSeedInput('');
      setGeneratedSeed('');
      setShowSeedInput(false);
      await fetchDrawStatus();
      if (onStatusUpdate) onStatusUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to commit seed');
    } finally {
      setLoading(false);
    }
  };

  const handleRevealSeed = async () => {
    if (!seedInput) {
      setError('Please enter the original seed to reveal');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await adminApi.revealDrawSeed(competitionId, seedInput);
      setSuccess('Seed revealed successfully!');
      setSeedInput('');
      setShowSeedInput(false);
      await fetchDrawStatus();
      if (onStatusUpdate) onStatusUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reveal seed');
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteDraw = async () => {
    if (!confirm('Are you sure you want to execute the draw? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await adminApi.executeDraw(competitionId);
      setSuccess(`Draw executed successfully! ${result.winnersCount} winner(s) selected.`);
      await fetchDrawStatus();
      if (onStatusUpdate) onStatusUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute draw');
    } finally {
      setLoading(false);
    }
  };

  const handleValidateIntegrity = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await adminApi.validateDrawIntegrity(competitionId);
      setValidationResult(result);
      if (result.valid) {
        setSuccess('Draw integrity validated successfully!');
      } else {
        setError(`Integrity validation failed: ${result.error}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate draw integrity');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMMITTED': return 'text-yellow-600 bg-yellow-50';
      case 'REVEALED': return 'text-blue-600 bg-blue-50';
      case 'USED': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const canCommitSeed = competitionStatus === 'ACTIVE' || competitionStatus === 'SOLD_OUT';
  const canRevealSeed = drawStatus?.seedCommitted && !drawStatus?.seedRevealed;
  const canExecuteDraw = drawStatus?.seedRevealed && competitionStatus !== 'COMPLETED';
  const isDrawComplete = competitionStatus === 'COMPLETED';

  return (
    <div className="space-y-6">
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span>{success}</span>
          </div>
        </div>
      )}

      {/* Draw Status Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Draw Management</h3>
          <button
            onClick={fetchDrawStatus}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            disabled={loading}
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading && !drawStatus ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : drawStatus ? (
          <div className="space-y-4">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Seed Status</span>
                  <Hash className="h-4 w-4 text-gray-400" />
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(drawStatus.seedStatus)}`}>
                  {drawStatus.seedStatus === 'NOT_COMMITTED' ? 'Not Committed' : drawStatus.seedStatus}
                </span>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Total Tickets</span>
                  <AlertCircle className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{drawStatus.statistics.totalTickets}</p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Draw Date</span>
                  <AlertCircle className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-900">{new Date(drawDate).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Draw Actions */}
            <div className="border-t pt-4 space-y-4">
              <h4 className="font-medium text-gray-800">Draw Actions</h4>

              {/* Step 1: Commit Seed */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-5 w-5 text-blue-600" />
                      <h5 className="font-medium text-gray-800">Step 1: Commit Seed</h5>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Generate and commit a secret seed hash before the draw. This ensures transparency and fairness.
                    </p>

                    {showSeedInput && !drawStatus.seedCommitted && (
                      <div className="space-y-3 mt-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Secret Seed
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={seedInput}
                              onChange={(e) => setSeedInput(e.target.value)}
                              placeholder="Enter or generate a seed"
                              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={generateRandomSeed}
                              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                              Generate
                            </button>
                          </div>
                          {generatedSeed && (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <p className="text-xs text-yellow-800">
                                <strong>Important:</strong> Save this seed securely! You'll need it to reveal and execute the draw.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {!drawStatus.seedCommitted ? (
                    <div className="flex gap-2">
                      {!showSeedInput ? (
                        <button
                          onClick={() => setShowSeedInput(true)}
                          disabled={!canCommitSeed || loading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Start Commitment
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setShowSeedInput(false);
                              setSeedInput('');
                              setGeneratedSeed('');
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleCommitSeed}
                            disabled={!seedInput || loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            Commit Seed
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  )}
                </div>
              </div>

              {/* Step 2: Reveal Seed */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Unlock className="h-5 w-5 text-indigo-600" />
                      <h5 className="font-medium text-gray-800">Step 2: Reveal Seed</h5>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Reveal the original seed to prepare for the draw execution.
                    </p>

                    {showSeedInput && canRevealSeed && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Original Seed
                        </label>
                        <input
                          type="text"
                          value={seedInput}
                          onChange={(e) => setSeedInput(e.target.value)}
                          placeholder="Enter the original seed"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>

                  {drawStatus.seedCommitted && !drawStatus.seedRevealed ? (
                    <div className="flex gap-2">
                      {!showSeedInput ? (
                        <button
                          onClick={() => setShowSeedInput(true)}
                          disabled={loading}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          Start Reveal
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setShowSeedInput(false);
                              setSeedInput('');
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleRevealSeed}
                            disabled={!seedInput || loading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                          >
                            Reveal Seed
                          </button>
                        </>
                      )}
                    </div>
                  ) : drawStatus.seedRevealed ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <Lock className="h-6 w-6 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Step 3: Execute Draw */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="h-5 w-5 text-green-600" />
                      <h5 className="font-medium text-gray-800">Step 3: Execute Draw</h5>
                    </div>
                    <p className="text-sm text-gray-600">
                      Execute the draw to select winners based on the revealed seed.
                    </p>
                  </div>

                  {canExecuteDraw ? (
                    <button
                      onClick={handleExecuteDraw}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                    >
                      Execute Draw
                    </button>
                  ) : isDrawComplete ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <Lock className="h-6 w-6 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Validation */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <h5 className="font-medium text-gray-800">Validate Integrity</h5>
                    </div>
                    <p className="text-sm text-gray-600">
                      Verify the integrity of the draw process and chain verification.
                    </p>
                  </div>

                  <button
                    onClick={handleValidateIntegrity}
                    disabled={loading || !drawStatus.seedCommitted}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
                  >
                    Validate
                  </button>
                </div>

                {validationResult && (
                  <div className={`mt-3 p-3 rounded-lg ${validationResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {validationResult.valid ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`font-medium ${validationResult.valid ? 'text-green-800' : 'text-red-800'}`}>
                        {validationResult.valid ? 'Draw Validated' : 'Validation Failed'}
                      </span>
                    </div>
                    {validationResult.drawSeed && (
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>Seed Committed: {validationResult.drawSeed.committed ? 'Yes' : 'No'}</p>
                        <p>Seed Revealed: {validationResult.drawSeed.revealed ? 'Yes' : 'No'}</p>
                        <p>Winners Count: {validationResult.winnersCount || 0}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Winners List */}
            {drawStatus.winners && drawStatus.winners.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-800 mb-3">Draw Winners</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Ticket</th>
                        <th className="px-4 py-2 text-left">Winner</th>
                        <th className="px-4 py-2 text-left">Prize</th>
                        <th className="px-4 py-2 text-left">Value</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {drawStatus.winners.map((winner) => (
                        <tr key={winner.winnerId}>
                          <td className="px-4 py-2">#{winner.ticketNumber}</td>
                          <td className="px-4 py-2">{winner.username}</td>
                          <td className="px-4 py-2">{winner.prizeName}</td>
                          <td className="px-4 py-2">£{(winner.prizeValue / 100).toFixed(2)}</td>
                          <td className="px-4 py-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              winner.claimStatus === 'CLAIMED' ? 'bg-green-100 text-green-800' :
                              winner.claimStatus === 'PAID' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {winner.claimStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600">No draw status available</p>
        )}
      </div>
    </div>
  );
}