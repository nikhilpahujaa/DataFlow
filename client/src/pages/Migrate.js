import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Database, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const Migrate = () => {
  const [formData, setFormData] = useState({
    target_db: 'postgresql',
    mysql_credentials: {
      host: 'localhost',
      port: 3306,
      database: '',
      user: '',
      password: '',
    },
    target_credentials: {
      host: 'localhost',
      port: 5432,
      database: '',
      user: '',
      password: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (showSuccess || showError) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setShowError(false);
      }, 5000); // Hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showSuccess, showError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Source MySQL inputs
    if (name.startsWith('mysql_')) {
      const field = name.replace('mysql_', '');
      setFormData((prev) => ({
        ...prev,
        mysql_credentials: {
          ...prev.mysql_credentials,
          [field]: value,
        },
      }));
      return;
    }

    // Target credentials inputs
    // Target DB selector
    if (name === 'target_db') {
      const isPostgres = value === 'postgresql';
      setFormData((prev) => ({
        ...prev,
        target_db: value,
        target_credentials: isPostgres
          ? { host: 'localhost', port: 5432, database: '', user: '', password: '' }
          : { uri: 'mongodb://localhost:27017', database: 'admin' }, // sensible default db name for MongoDB
      }));
      return;
    }
    
    // Target credentials inputs
    if (name.startsWith('target_')) {
      const field = name.replace('target_', '');
      setFormData((prev) => ({
        ...prev,
        target_credentials: {
          ...prev.target_credentials,
          [field]: value,
        },
      }));
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setShowError(false);
    setShowSuccess(false);

    try {
      const response = await fetch('/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to migrate database');
      }

      setResult(data);
      setShowSuccess(true);
    } catch (err) {
      setError(err.message);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const getTargetPort = () => {
    if (formData.target_db === 'postgresql') return 5432;
    if (formData.target_db === 'mongodb') return 27017;
    return 5432;
  };

  const getTargetDatabaseFields = () => {
    if (formData.target_db === 'postgresql') {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Database Name</label>
            <input
              type="text"
              name="target_database"
              value={formData.target_credentials.database || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter database name"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                name="target_user"
                value={formData.target_credentials.user || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="postgres"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="target_password"
                value={formData.target_credentials.password || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter password"
                required
              />
            </div>
          </div>
        </>
      );
    }

    if (formData.target_db === 'mongodb') {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Connection URI</label>
            <input
              type="text"
              name="target_uri"
              value={formData.target_credentials.uri || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="mongodb://localhost:27017"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Database Name</label>
            <input
              type="text"
              name="target_database"
              value={formData.target_credentials.database || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter database name"
              required
            />
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Migration</h1>
        <p className="text-gray-600">
          Migrate your MySQL database to PostgreSQL or MongoDB with automatic schema conversion.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Target Database Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Select Target Database</h2>
          <select
            name="target_db"
            value={formData.target_db}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="postgresql">PostgreSQL</option>
            <option value="mongodb">MongoDB</option>
          </select>
        </div>

        {/* Two Column Layout for Source and Target */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MySQL Source Database Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
              <Database className="w-5 h-5 mr-2 text-blue-600" />
              MySQL Source Database
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
                  <input
                    type="text"
                    name="mysql_host"
                    value={formData.mysql_credentials.host || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="localhost"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                  <input
                    type="number"
                    name="mysql_port"
                    value={formData.mysql_credentials.port || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="3306"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Database Name</label>
                <input
                  type="text"
                  name="mysql_database"
                  value={formData.mysql_credentials.database || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter database name"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    name="mysql_user"
                    value={formData.mysql_credentials.user || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="mysql_password"
                    value={formData.mysql_credentials.password || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Target Database Connection Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
              <Database className="w-5 h-5 mr-2 text-primary-600" />
              {formData.target_db === 'postgresql' ? 'PostgreSQL' : 'MongoDB'} Connection Details
            </h2>
            <div className="space-y-4">
              {formData.target_db === 'postgresql' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
                      <input
                        type="text"
                        name="target_host"
                        value={formData.target_credentials.host || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="localhost"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                      <input
                        type="number"
                        name="target_port"
                        value={formData.target_credentials.port || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={getTargetPort()}
                        required
                      />
                    </div>
                  </div>
                  {getTargetDatabaseFields()}
                </>
              ) : (
                <>
                  {getTargetDatabaseFields()}
                </>
              )}
            </div>
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
                Migrating...
              </>
            ) : (
              <>
                <ArrowRightLeft className="h-5 w-5 mr-2" />
                Start Migration
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Display */}
      {showError && error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">Error</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Success Display */}
      {showSuccess && result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">Success</span>
          </div>
          <p className="text-green-700 mt-1">{result.message}</p>
        </div>
      )}
    </div>
  );
};

export default Migrate;

