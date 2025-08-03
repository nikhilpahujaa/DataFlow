import React from 'react';
import { Link } from 'react-router-dom';
import {
  Database,
  BarChart3,
  ArrowRightLeft,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Database,
      title: 'Schema Analysis',
      description: 'Automatically analyze your MySQL database structure, relationships, and data types.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: BarChart3,
      title: 'Smart Recommendations',
      description: 'Get intelligent suggestions for the best target database based on your schema.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: ArrowRightLeft,
      title: 'Data Migration',
      description: 'Seamlessly migrate both structure and data between different database systems.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Shield,
      title: 'Type Mapping',
      description: 'Automatic data type conversion between MySQL, PostgreSQL, and MongoDB.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'High-performance migration with comprehensive error handling and status reporting.',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: CheckCircle,
      title: 'Relationship Preservation',
      description: 'Maintain foreign key relationships and data integrity during migration.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-block p-4 bg-purple-600 rounded-lg">
          <Zap className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900">
          DataFlow
        </h1>
        <p className="text-xl text-gray-500">
          Migration Studio
        </p>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Migrate your data between different database systems with intelligent schema analysis 
          and smart recommendations.
        </p>
        <div className="flex justify-center space-x-2 pt-4">
          <Link
            to="/analyze"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            <BarChart3 className="h-5 w-5 mr-2" />
            Analyze Database
          </Link>
          <Link
            to="/migrate"
            className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowRightLeft className="h-5 w-5 mr-2" />
            Start Migration
          </Link>
        </div>
      </div>

      {/* Supported Databases */}
      <div className="pt-4 pb-8">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
          Supported Databases
        </h2>
        <div className="flex justify-center items-center space-x-8 h-32">
          {/* Source DB */}
          <span className={`px-4 py-2 rounded-full text-lg font-semibold bg-blue-100 text-blue-800`}>
            MySQL
          </span>

          {/* Arrows and Target DBs */}
          <div className="flex items-center space-x-8">
            <div className="flex flex-col space-y-8">
                <ArrowRight className="h-10 w-10 text-gray-400" />
                <ArrowRight className="h-10 w-10 text-gray-400" />
            </div>
            <div className="flex flex-col space-y-8">
                <span className={`px-4 py-2 rounded-full text-lg font-semibold bg-green-100 text-green-800 text-center`}>
                    PostgreSQL
                </span>
                <span className={`px-4 py-2 rounded-full text-lg font-semibold bg-purple-100 text-purple-800 text-center`}>
                    MongoDB
                </span>
            </div>
          </div>
        </div>
       </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor} mb-4`}>
                <Icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      {/* <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/analyze"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <BarChart3 className="h-8 w-8 text-primary-600 mr-4" />
            <div>
              <h3 className="font-semibold text-gray-900">Analyze Database</h3>
              <p className="text-sm text-gray-600">Inspect schema and get recommendations</p>
            </div>
          </Link>
          <Link
            to="/migrate"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <ArrowRightLeft className="h-8 w-8 text-primary-600 mr-4" />
            <div>
              <h3 className="font-semibold text-gray-900">Start Migration</h3>
              <p className="text-sm text-gray-600">Migrate data to target database</p>
            </div>
          </Link>
        </div>
      </div> */}
    </div>
  );
};

export default Home;