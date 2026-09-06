#!/usr/bin/env node
/**
 * NewVexorion - Server Entry Point
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
import { server, logger } from './src/Server.js'

// Start the server
server.start()

// Log startup
logger.info('✅ NewVexorion server initialized')
logger.info('📊 Press Ctrl+C to stop')

// Handle uncaught exceptions
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled rejection:', error)
})

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error)
  process.exit(1)
})
