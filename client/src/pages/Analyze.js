import React, { useState } from "react";
import {
  BarChart3,
  Table,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import SkeletonLoader from "../components/SkeletonLoader";

const Analyze = () => {
  const [formData, setFormData] = useState({
    mysql_host: "",
    mysql_port: 3306,
    mysql_database: "",
    mysql_user: "",
    mysql_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to analyze database");
      }

      setResult(data);
    } catch (err) {
      if (err.message.includes("JSON")) {
        setError(
          "API server is not available. Please check if the backend is running."
        );
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation?.toLowerCase()) {
      case "postgresql":
        return "text-green-600 bg-green-50 dark:bg-green-900/30";
      case "mysql":
        return "text-blue-600 bg-blue-50 dark:bg-blue-900/30";
      case "mongodb":
        return "text-purple-600 bg-purple-50 dark:bg-purple-900/30";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-700";
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Database Analysis
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 px-4">
          Connect to your MySQL database to analyze its schema and get
          intelligent recommendations.
        </p>
      </div>

      {/* Connection Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Database Connection
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Host
              </label>
              <input
                type="text"
                name="mysql_host"
                value={formData.mysql_host}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                placeholder="your-database-host.com or IP address"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Port
              </label>
              <input
                type="number"
                name="mysql_port"
                value={formData.mysql_port}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                placeholder="3306"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
              Database Name
            </label>
            <input
              type="text"
              name="mysql_database"
              value={formData.mysql_database}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              placeholder="Enter database name"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Username
              </label>
              <input
                type="text"
                name="mysql_user"
                value={formData.mysql_user}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Password
              </label>
              <input
                type="password"
                name="mysql_password"
                value={formData.mysql_password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                placeholder="Enter password"
                required
              />
            </div>
          </div>
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 sm:px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Analyze Database
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-6">
          <SkeletonLoader type="form" />
          <div className="text-center">
            <LoadingSpinner size="lg" text="Analyzing database schema..." />
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 animate-in slide-in-from-top-2">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 dark:text-red-200 font-medium">
              Error
            </span>
          </div>
          <p className="text-red-700 dark:text-red-300 mt-1 text-sm sm:text-base">
            {error}
          </p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="space-y-4 sm:space-y-6 animate-in slide-in-from-bottom-2">
          {/* Recommendation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Recommendation
            </h3>
            <div className="flex items-center space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getRecommendationColor(
                  result.recommendation
                )}`}
              >
                {result.recommendation}
              </span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base whitespace-pre-line">
              {result.summary}
            </p>
          </div>

          {/* Schema Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Schema Analysis
            </h3>

            {/* Tables */}
            <div className="mb-4 sm:mb-6">
              <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Table className="h-4 w-4 mr-2" />
                Tables ({result.analysis.tables?.length || 0})
              </h4>
              <div className="space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
                {result.analysis.tables?.map((table, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                      <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                        {table.name}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {table.columns?.length || 0} columns
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <span>
                          Primary Keys:{" "}
                          {table.primary_keys?.join(", ") || "None"}
                        </span>
                        <span>Columns: {table.columns?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No tables found
                  </p>
                )}
              </div>
            </div>

            {/* Relationships */}
            <div>
              <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <LinkIcon className="h-4 w-4 mr-2" />
                Relationships ({result.analysis.relationships?.length || 0})
              </h4>
              <div className="space-y-2 max-h-36 sm:max-h-48 overflow-y-auto">
                {result.analysis.relationships?.map((rel, index) => (
                  <div
                    key={index}
                    className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded break-all"
                  >
                    {rel.table}.{rel.column} → {rel.ref_table}.{rel.ref_column}
                  </div>
                )) || (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No relationships found
                  </p>
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
