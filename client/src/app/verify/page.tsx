'use client';

import { useState, useEffect } from 'react';

interface ChainEntry {
  sequence: number;
  type: string;
  hash: string;
  previousHash: string | null;
  timestamp: string;
  data: any;
  metadata?: any;
}

interface ChainIntegrity {
  isValid: boolean;
  totalEntries: number;
  verifiedEntries: number;
  verificationRange: {
    start: number;
    end: number;
  };
  checkpoints: {
    total: number;
    verified: number;
    latest?: any;
  };
}

interface TicketVerification {
  ticketId: string;
  ticketNumber: string;
  isValid: boolean;
  verification: {
    hashValid: boolean;
    chainIntact: boolean;
    purchaseProven: boolean;
  };
  details?: {
    competitionId: string;
    userId: string;
    purchasePrice: string;
    purchasedAt: string;
    chainHash: string;
    sequence: number;
  };
}

export default function VerifyPage() {
  const [chainIntegrity, setChainIntegrity] = useState<ChainIntegrity | null>(null);
  const [recentEntries, setRecentEntries] = useState<ChainEntry[]>([]);
  const [latestCheckpoint, setLatestCheckpoint] = useState<any>(null);
  const [ticketVerification, setTicketVerification] = useState<TicketVerification | null>(null);
  const [ticketId, setTicketId] = useState('');
  const [competitionId, setCompetitionId] = useState('');
  const [drawResults, setDrawResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('chain');

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    loadChainIntegrity();
    loadLatestCheckpoint();
    loadVerificationReport();
  }, []);

  const loadChainIntegrity = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/verify/chain/integrity`);
      if (response.ok) {
        const data = await response.json();
        setChainIntegrity(data);
      }
    } catch (error) {
      console.error('Failed to load chain integrity:', error);
    }
  };

  const loadLatestCheckpoint = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/verify/checkpoints/latest`);
      if (response.ok) {
        const data = await response.json();
        setLatestCheckpoint(data);
      }
    } catch (error) {
      console.error('Failed to load checkpoint:', error);
    }
  };

  const loadVerificationReport = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/verify/report`);
      if (response.ok) {
        const data = await response.json();
        setRecentEntries(data.recentEntries || []);
      }
    } catch (error) {
      console.error('Failed to load verification report:', error);
    }
  };

  const verifyTicket = async () => {
    if (!ticketId.trim()) {
      setError('Please enter a ticket ID');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/verify/ticket/${ticketId.trim()}`);
      if (response.ok) {
        const data = await response.json();
        setTicketVerification(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to verify ticket');
        setTicketVerification(null);
      }
    } catch (error) {
      setError('Network error occurred while verifying ticket');
      setTicketVerification(null);
    } finally {
      setLoading(false);
    }
  };

  const verifyDrawResults = async () => {
    if (!competitionId.trim()) {
      setError('Please enter a competition ID');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/verify/competition/${competitionId.trim()}/draw-results`);
      if (response.ok) {
        const data = await response.json();
        setDrawResults(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to verify draw results');
        setDrawResults(null);
      }
    } catch (error) {
      setError('Network error occurred while verifying draw results');
      setDrawResults(null);
    } finally {
      setLoading(false);
    }
  };

  const formatHash = (hash: string) => {
    if (!hash) return 'N/A';
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getEntryTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'TICKET_PURCHASE': 'bg-blue-100 text-blue-800 border-blue-200',
      'PRIZE_ALLOCATION': 'bg-green-100 text-green-800 border-green-200',
      'DRAW_RESULT': 'bg-purple-100 text-purple-800 border-purple-200',
      'PRIZE_CLAIM': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'COMPETITION_STATE_CHANGE': 'bg-orange-100 text-orange-800 border-orange-200',
      'INSTANT_WIN_REVEAL': 'bg-pink-100 text-pink-800 border-pink-200',
      'SEED_COMMIT': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'SEED_REVEAL': 'bg-red-100 text-red-800 border-red-200',
      'CHECKPOINT': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const CheckIcon = () => (
    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );

  const XIcon = () => (
    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  );

  const ShieldIcon = () => (
    <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  const HashIcon = () => (
    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
    </svg>
  );

  const LinkIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Chain Verification Portal</h1>
          <p className="text-xl text-gray-600 mb-6">
            Verify the integrity and authenticity of all raffle operations through our tamper-evident hash chain
          </p>

          {/* Chain Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                {chainIntegrity?.isValid ? <CheckIcon /> : <XIcon />}
              </div>
              <h3 className="font-semibold text-lg text-gray-900">Chain Integrity</h3>
              <p className="text-sm text-gray-600">
                {chainIntegrity?.isValid ? 'Verified & Secure' : 'Verification Failed'}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <HashIcon />
              </div>
              <h3 className="font-semibold text-lg text-gray-900">Total Entries</h3>
              <p className="text-2xl font-bold text-blue-600">
                {chainIntegrity?.totalEntries || 0}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <ShieldIcon />
              </div>
              <h3 className="font-semibold text-lg text-gray-900">Checkpoints</h3>
              <p className="text-2xl font-bold text-purple-600">
                {chainIntegrity?.checkpoints.verified || 0}/{chainIntegrity?.checkpoints.total || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'chain', label: 'Chain Explorer' },
                { id: 'ticket', label: 'Verify Ticket' },
                { id: 'draw', label: 'Draw Results' },
                { id: 'checkpoint', label: 'Checkpoints' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Chain Explorer Tab */}
        {activeTab === 'chain' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <LinkIcon />
                <h2 className="text-lg font-semibold text-gray-900">Recent Chain Entries</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Live view of the most recent operations recorded in the hash chain
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentEntries.map((entry, index) => (
                  <div key={entry.sequence} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-white border rounded text-sm font-mono">
                          #{entry.sequence}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getEntryTypeColor(entry.type)}`}>
                          {entry.type.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatTimestamp(entry.timestamp)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong className="text-gray-700">Hash:</strong>
                        <div className="font-mono bg-white p-2 rounded border mt-1 text-gray-800">
                          {formatHash(entry.hash)}
                        </div>
                      </div>
                      <div>
                        <strong className="text-gray-700">Previous Hash:</strong>
                        <div className="font-mono bg-white p-2 rounded border mt-1 text-gray-800">
                          {entry.previousHash ? formatHash(entry.previousHash) : 'Genesis Block'}
                        </div>
                      </div>
                    </div>

                    {index < recentEntries.length - 1 && (
                      <div className="flex justify-center mt-4">
                        <div className="w-0.5 h-4 bg-gray-300"></div>
                      </div>
                    )}
                  </div>
                ))}
                {recentEntries.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No chain entries available yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Ticket Verification Tab */}
        {activeTab === 'ticket' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Verify Ticket Authenticity</h2>
              <p className="text-sm text-gray-600 mt-1">
                Enter a ticket ID to verify its authenticity and chain proof
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter ticket ID (e.g., TKT-ABC123-1234567890-ABCD-001)"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={verifyTicket}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <XIcon />
                  <span className="text-red-700">{error}</span>
                </div>
              )}

              {ticketVerification && (
                <div className={`border rounded-lg p-6 ${ticketVerification.isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    {ticketVerification.isValid ? <CheckIcon /> : <XIcon />}
                    <h3 className="text-lg font-semibold text-gray-900">
                      Ticket {ticketVerification.isValid ? 'Verified' : 'Verification Failed'}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <strong className="text-gray-700">Ticket Number:</strong>
                      <p className="font-mono text-gray-800">{ticketVerification.ticketNumber}</p>
                    </div>
                    {ticketVerification.details && (
                      <>
                        <div>
                          <strong className="text-gray-700">Purchase Price:</strong>
                          <p className="text-gray-800">£{ticketVerification.details.purchasePrice}</p>
                        </div>
                        <div>
                          <strong className="text-gray-700">Chain Sequence:</strong>
                          <p className="text-gray-800">#{ticketVerification.details.sequence}</p>
                        </div>
                        <div>
                          <strong className="text-gray-700">Purchased At:</strong>
                          <p className="text-gray-800">{formatTimestamp(ticketVerification.details.purchasedAt)}</p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Verification Checks:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {[
                        { label: 'Hash Valid', valid: ticketVerification.verification.hashValid },
                        { label: 'Chain Intact', valid: ticketVerification.verification.chainIntact },
                        { label: 'Purchase Proven', valid: ticketVerification.verification.purchaseProven }
                      ].map((check) => (
                        <div key={check.label} className={`flex items-center gap-2 p-2 rounded ${check.valid ? 'bg-green-100' : 'bg-red-100'}`}>
                          {check.valid ? (
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          )}
                          <span className="text-sm text-gray-700">{check.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Draw Results Tab */}
        {activeTab === 'draw' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Verify Draw Results</h2>
              <p className="text-sm text-gray-600 mt-1">
                Enter a competition ID to verify its draw results and fairness
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter competition ID"
                  value={competitionId}
                  onChange={(e) => setCompetitionId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={verifyDrawResults}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify Draw'}
                </button>
              </div>

              {drawResults && (
                <div className="border rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center gap-3 mb-4">
                    {drawResults.verification.isValid ? <CheckIcon /> : <XIcon />}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {drawResults.competitionTitle}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <strong className="text-gray-700">Status:</strong>
                      <p className="text-gray-800">{drawResults.status}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700">Draw Date:</strong>
                      <p className="text-gray-800">{formatTimestamp(drawResults.drawDate)}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700">Seed Committed:</strong>
                      <p className="text-gray-800">{drawResults.seedCommitted ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700">Seed Revealed:</strong>
                      <p className="text-gray-800">{drawResults.seedRevealed ? 'Yes' : 'No'}</p>
                    </div>
                  </div>

                  {drawResults.results.winners.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-900">Winners ({drawResults.results.winnersCount})</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {drawResults.results.winners.map((winner: any) => (
                          <div key={winner.winnerId} className="border rounded p-3 bg-white">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <div>
                                <strong className="text-gray-700">Ticket:</strong> <span className="text-gray-800">{winner.ticketNumber}</span>
                              </div>
                              <div>
                                <strong className="text-gray-700">Winner:</strong> <span className="text-gray-800">{winner.username}</span>
                              </div>
                              <div>
                                <strong className="text-gray-700">Prize:</strong> <span className="text-gray-800">{winner.prizeName}</span>
                              </div>
                              <div>
                                <strong className="text-gray-700">Value:</strong> <span className="text-gray-800">£{winner.prizeValue}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {drawResults.chainProof && (
                    <div className="mt-4 p-3 bg-gray-100 rounded">
                      <strong className="text-gray-900">Chain Proof:</strong>
                      <div className="font-mono text-sm mt-1 text-gray-700">
                        Hash: {formatHash(drawResults.chainProof.hash)}<br />
                        Sequence: #{drawResults.chainProof.sequence}<br />
                        Timestamp: {formatTimestamp(drawResults.chainProof.timestamp)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Checkpoints Tab */}
        {activeTab === 'checkpoint' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <ShieldIcon />
                <h2 className="text-lg font-semibold text-gray-900">Latest Checkpoint</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Checkpoint information for chain integrity verification
              </p>
            </div>
            <div className="p-6">
              {latestCheckpoint?.exists ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <strong className="text-gray-700">Sequence:</strong>
                      <p className="text-gray-800">#{latestCheckpoint.checkpoint.sequence}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700">Entries Count:</strong>
                      <p className="text-gray-800">{latestCheckpoint.checkpoint.entriesCount}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700">Range:</strong>
                      <p className="text-gray-800">{latestCheckpoint.checkpoint.range.start} - {latestCheckpoint.checkpoint.range.end}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700">Created:</strong>
                      <p className="text-gray-800">{formatTimestamp(latestCheckpoint.checkpoint.createdAt)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <strong className="text-gray-700">Merkle Root:</strong>
                      <div className="font-mono bg-gray-100 p-2 rounded text-sm text-gray-800 break-all">
                        {latestCheckpoint.checkpoint.merkleRoot}
                      </div>
                    </div>
                    <div>
                      <strong className="text-gray-700">Hash:</strong>
                      <div className="font-mono bg-gray-100 p-2 rounded text-sm text-gray-800 break-all">
                        {latestCheckpoint.checkpoint.hash}
                      </div>
                    </div>
                  </div>

                  {latestCheckpoint.checkpoint.publishedHash && (
                    <div>
                      <strong className="text-gray-700">Published Hash:</strong>
                      <div className="font-mono bg-green-100 p-2 rounded text-sm text-gray-800 break-all">
                        {latestCheckpoint.checkpoint.publishedHash}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Published: {formatTimestamp(latestCheckpoint.checkpoint.publishedTimestamp)}
                      </p>
                    </div>
                  )}

                  {latestCheckpoint.verification && (
                    <div className="p-3 bg-gray-50 rounded">
                      <strong className="text-gray-700">Verification Status:</strong>
                      <div className="flex items-center gap-2 mt-1">
                        {latestCheckpoint.verification.isValid ? <CheckIcon /> : <XIcon />}
                        <span className="text-gray-800">
                          {latestCheckpoint.verification.isValid ? 'Valid' : 'Invalid'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No checkpoints available yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}