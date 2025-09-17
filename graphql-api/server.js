#!/usr/bin/env node
require('dotenv').config();
const { postgraphile } = require('postgraphile');
const PgSimplifyInflectorPlugin = require('@graphile-contrib/pg-simplify-inflector');
// Removed PgAggregatesPlugin due to compatibility issues
const ConnectionFilterPlugin = require('postgraphile-plugin-connection-filter');

// Database connection
const DATABASE_URL = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

console.log('🚀 Starting TAC Blockchain GraphQL API...');
console.log(`📊 Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
console.log(`🌐 GraphQL Endpoint: http://localhost:${process.env.PORT}/graphql`);
console.log(`🔍 GraphiQL IDE: http://localhost:${process.env.PORT}/graphiql`);

// Custom plugin for blockchain-specific functionality
const BlockchainPlugin = (builder) => {
  builder.hook('GraphQLObjectType:fields', (fields, build, context) => {
    const {
      scope: { pgIntrospection: table }
    } = context;

    // Add computed fields for blocks
    if (table && table.name === 'blocks') {
      const { GraphQLString, GraphQLInt } = build.graphql;

      fields.heightFormatted = {
        type: GraphQLString,
        description: 'Block height formatted as a string',
        resolve: (block) => `Block #${block.height.toLocaleString()}`
      };

      fields.ageInSeconds = {
        type: GraphQLInt,
        description: 'Age of the block in seconds',
        resolve: (block) => Math.floor((new Date() - new Date(block.timeStamp)) / 1000)
      };
    }

    // Add computed fields for transactions
    if (table && table.name === 'txs') {
      const { GraphQLBoolean, GraphQLString } = build.graphql;

      fields.isSuccessful = {
        type: GraphQLBoolean,
        description: 'Whether the transaction was successful (code = 0)',
        resolve: (tx) => tx.code === 0
      };

      fields.shortHash = {
        type: GraphQLString,
        description: 'Shortened transaction hash',
        resolve: (tx) => tx.hash ? `${tx.hash.slice(0, 8)}...${tx.hash.slice(-8)}` : null
      };
    }

    return fields;
  });
};

// PostGraphile middleware configuration
const postgraphileOptions = {
  // Database schema
  schemaName: 'public',

  // Plugins for enhanced functionality
  appendPlugins: [
    PgSimplifyInflectorPlugin,     // Simplifies field names (removes unnecessary prefixes)
    ConnectionFilterPlugin,        // Adds advanced filtering capabilities
    BlockchainPlugin              // Custom blockchain-specific functionality
  ],

  // GraphiQL configuration
  graphiql: true,
  enhanceGraphiql: true,

  // Development features
  watchPg: process.env.NODE_ENV === 'development',
  showErrorStack: process.env.NODE_ENV === 'development',

  // Performance and caching
  retryOnInitFail: true,
  dynamicJson: true,

  // CORS and security
  enableCors: true,

  // Advanced features
  subscriptions: true,           // Real-time subscriptions
  live: true,                   // Live queries

  // Query complexity
  queryDepthLimit: 12,

  // Custom routes
  graphqlRoute: process.env.GRAPHQL_ROUTE || '/graphql',
  graphiqlRoute: process.env.GRAPHIQL_ROUTE || '/graphiql',

  // Performance settings
  pgSettings: {
    statement_timeout: '30000',  // 30 second timeout
  },

  // Additional options for blockchain data
  legacyRelations: 'omit',      // Use modern relation names
  setofFunctionsContainNulls: false,

  // Error handling
  extendedErrors: process.env.NODE_ENV === 'development' ? ['hint', 'detail', 'errcode'] : ['errcode']
};

// Create Express server with PostGraphile
const express = require('express');
const app = express();

// Add PostGraphile middleware
app.use(postgraphile(DATABASE_URL, 'public', postgraphileOptions));

// Start the server
app.listen(process.env.PORT || 5000, () => {
  console.log('✅ GraphQL API is running!');
  console.log('');
  console.log('📚 Available endpoints:');
  console.log(`   GraphQL API: http://localhost:${process.env.PORT || 5000}/graphql`);
  console.log(`   GraphiQL IDE: http://localhost:${process.env.PORT || 5000}/graphiql`);
  console.log('');
  console.log('🔥 Enhanced features enabled:');
  console.log('   ✅ Auto-generated schema from PostgreSQL');
  console.log('   ✅ Advanced filtering and pagination');
  console.log('   ✅ Real-time subscriptions');
  console.log('   ✅ Custom blockchain fields');
  console.log('   ✅ Enhanced GraphiQL IDE');
  console.log('   ✅ Simplified field names');
  console.log('');
  console.log('💡 Ready to query your TAC blockchain data!');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down GraphQL API...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down GraphQL API...');
  process.exit(0);
});