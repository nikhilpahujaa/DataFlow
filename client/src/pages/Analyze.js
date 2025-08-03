import React, { useState } from 'react';
import { BarChart3, Table, Link as LinkIcon, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const Analyze = () => {
  const [formData, setFormData] = useState({
    mysql_host: 'localhost',
    mysql_port: 3306,
    mysql_database: '',
    mysql_user: '',
    mysql_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to analyze database');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation?.toLowerCase()) {
      case 'postgresql':
        return 'text-green-600 bg-green-50';
      case 'mysql':
        return 'text-blue-600 bg-blue-50';
      case 'mongodb':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Database Analysis
        </h1>
        <p className="text-gray-600">
          Connect to your MySQL database to analyze its schema and get intelligent recommendations.
        </p>
      </div>

      {/* Connection Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Database Connection
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Host
              </label>
              <input
                type="text"
                name="mysql_host"
                value={formData.mysql_host}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="localhost"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Port
              </label>
              <input
                type="number"
                name="mysql_port"
                value={formData.mysql_port}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="3306"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Database Name
            </label>
            <input
              type="text"
              name="mysql_database"
              value={formData.mysql_database}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter database name"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="mysql_user"
                value={formData.mysql_user}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="mysql_password"
                value={formData.mysql_password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter password"
                required
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Analyze Database
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">Error</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="space-y-6">
          {/* Recommendation */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recommendation
            </h3>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRecommendationColor(result.recommendation)}`}>
                {result.recommendation}
              </span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-gray-600 mt-2">{result.summary}</p>
          </div>

          {/* Schema Analysis */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Schema Analysis
            </h3>
            
            {/* Tables */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                <Table className="h-4 w-4 mr-2" />
                Tables ({result.analysis.tables?.length || 0})
              </h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {result.analysis.tables?.map((table, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{table.name}</span>
                      <span className="text-sm text-gray-500">
                        {table.columns?.length || 0} columns
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="grid grid-cols-2 gap-2">
                        <span>Primary Keys: {table.primary_keys?.join(', ') || 'None'}</span>
                        <span>Columns: {table.columns?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 text-sm">No tables found</p>
                )}
              </div>
            </div>

            {/* Relationships */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                <LinkIcon className="h-4 w-4 mr-2" />
                Relationships ({result.analysis.relationships?.length || 0})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {result.analysis.relationships?.map((rel, index) => (
                  <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {rel.table}.{rel.column} → {rel.ref_table}.{rel.ref_column}
                  </div>
                )) || (
                  <p className="text-gray-500 text-sm">No relationships found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyze;