/**
 * NewVexorion - Backend Server
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config } from './Config.js'
import { logger } from './Logger.js'
import { DataProcessorEnhanced } from './DataProcessorEnhanced.js'
import { AssetProcessor } from './AssetProcessor.js'
import { StreamProcessor } from './StreamProcessor.js'
import { DataTransformer } from './DataTransformer.js'
import { DataAggregator } from './DataAggregator.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

class Server {
  #app = null
  #server = null
  #wss = null
  #port = null
  #connections = new Set()
  #isRunning = false
  #processors = {}

  constructor() {
    this.#app = express()
    this.#port = process.env.PORT || config.getWebPort() || 8080
    this.#setupMiddleware()
    this.#setupRoutes()
    this.#setupWebSocket()
    this.#setupErrorHandling()
  }

  /**
   * Setup middleware
   */
  #setupMiddleware() {
    // Security
    this.#app.use(helmet({ contentSecurityPolicy: false }))
    this.#app.use(cors())
    this.#app.use(compression())
    
    // Logging
    this.#app.use(morgan('combined', {
      stream: {
        write: (message) => logger.info(message.trim())
      }
    }))
    
    // Body parsing
    this.#app.use(express.json({ limit: '50mb' }))
    this.#app.use(express.urlencoded({ extended: true, limit: '50mb' }))
    
    // Static files
    const rootPath = join(__dirname, '..')
    const webPath = join(__dirname, '../web')
    this.#app.use('/web', express.static(webPath))
    this.#app.use(express.static(webPath))
    this.#app.use(express.static(rootPath))
    
    // API routes prefix
    this.#app.use('/api', this.#createApiRouter())
  }

  /**
   * Setup API routes
   */
  #setupRoutes() {
    // Health check
    this.#app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: '2.1.0'
      })
    })

    // Root - Demo Portal
    this.#app.get('/', (req, res) => {
      res.sendFile(join(__dirname, '../index.html'))
    })

    // Basic Viewer
    this.#app.get('/basic', (req, res) => {
      res.sendFile(join(__dirname, '../web/index.html'))
    })

    // Enhanced UI
    this.#app.get('/enhanced', (req, res) => {
      res.sendFile(join(__dirname, '../web/index-enhanced.html'))
    })

    // Dashboard UI
    this.#app.get('/dashboard', (req, res) => {
      res.sendFile(join(__dirname, '../web/dashboard.html'))
    })

    // Assets UI
    this.#app.get('/assets-view', (req, res) => {
      res.sendFile(join(__dirname, '../web/assets.html'))
    })

    // API Docs UI
    this.#app.get('/api-docs', (req, res) => {
      res.sendFile(join(__dirname, '../web/api.html'))
    })
  }

  /**
   * Create API router
   */
  #createApiRouter() {
    const router = express.Router()

    // ============ DATA PROCESSING ============
    
    // Process data
    router.post('/process', async (req, res) => {
      try {
        const { inputFile, outputFile, patterns, options = {} } = req.body
        
        const processor = new DataProcessorEnhanced({
          inputFile: inputFile || 'example/Vexorion.html',
          outputFile: outputFile || 'output/api_result.txt',
          patterns: patterns || config.getPatterns()
        })

        const result = processor
          .processWithParsing()
          .getObjects()

        // Save to processor cache
        const sessionId = Date.now().toString()
        this.#processors[sessionId] = { processor, result }

        this.#broadcast({
          type: 'processing:complete',
          data: { sessionId, count: result.length }
        })

        res.json({
          success: true,
          sessionId,
          count: result.length,
          data: result
        })
      } catch (error) {
        logger.error('API /process error:', error)
        res.status(500).json({
          success: false,
          error: error.message
        })
      }
    })

    // Process assets
    router.post('/assets', async (req, res) => {
      try {
        const { assetsPath = 'assets', extensions = null } = req.body
        
        const results = AssetProcessor.processAll(assetsPath, extensions)
        const summary = new AssetProcessor(assetsPath).getSummary()

        this.#broadcast({
          type: 'assets:complete',
          data: { summary }
        })

        res.json({
          success: true,
          summary,
          results
        })
      } catch (error) {
        logger.error('API /assets error:', error)
        res.status(500).json({
          success: false,
          error: error.message
        })
      }
    })

    // Stream process
    router.post('/stream', async (req, res) => {
      try {
        const { inputFile, outputFile, patterns } = req.body
        
        const success = await StreamProcessor.process(
          inputFile || 'example/Vexorion.html',
          outputFile || 'output/stream_api_result.txt',
          patterns || config.getPatterns()
        )

        this.#broadcast({
          type: 'stream:complete',
          data: { success }
        })

        res.json({ success })
      } catch (error) {
        logger.error('API /stream error:', error)
        res.status(500).json({
          success: false,
          error: error.message
        })
      }
    })

    // ============ DATA SEARCH ============
    
    router.post('/search', async (req, res) => {
      try {
        const { sessionId, term, fields = [] } = req.body
        
        if (!sessionId || !this.#processors[sessionId]) {
          return res.status(404).json({
            success: false,
            error: 'Session not found'
          })
        }

        const { processor } = this.#processors[sessionId]
        const results = processor.search(term, fields).getObjects()

        res.json({
          success: true,
          count: results.length,
          data: results
        })
      } catch (error) {
        logger.error('API /search error:', error)
        res.status(500).json({
          success: false,
          error: error.message
        })
      }
    })

    // ============ DATA EXPORT ============
    
    router.post('/export', async (req, res) => {
      try {
        const { sessionId, format = 'csv', filename } = req.body
        
        if (!sessionId || !this.#processors[sessionId]) {
          return res.status(404).json({
            success: false,
            error: 'Session not found'
          })
        }

        const { processor } = this.#processors[sessionId]
        let filePath = filename || `output/export_${Date.now()}`
        
        let success = false
        switch (format.toLowerCase()) {
          case 'csv':
            success = processor.exportCSV(`${filePath}.csv`)
            break
          case 'json':
            success = processor.exportJSON(`${filePath}.json`)
            break
          case 'html':
            success = processor.exportHTML(`${filePath}.html`)
            break
          default:
            return res.status(400).json({
              success: false,
              error: `Unsupported format: ${format}`
            })
        }

        res.json({
          success,
          format,
          filePath: `${filePath}.${format}`
        })
      } catch (error) {
        logger.error('API /export error:', error)
        res.status(500).json({
          success: false,
          error: error.message
        })
      }
    })

    // ============ TRANSFORM ============
    
    router.post('/transform', async (req, res) => {
      try {
        const { data, operation, options = {} } = req.body
        
        let result
        switch (operation) {
          case 'select':
            result = DataTransformer.select(data, options.fields)
            break
          case 'sort':
            result = DataTransformer.sort(data, options.key, options.order)
            break
          case 'group':
            result = DataTransformer.groupBy(data, options.key)
            break
          case 'filter':
            result = DataTransformer.filter(data, options.predicate)
            break
          default:
            return res.status(400).json({
              success: false,
              error: `Unsupported operation: ${operation}`
            })
        }

        res.json({
          success: true,
          count: Array.isArray(result) ? result.length : Object.keys(result).length,
          data: result
        })
      } catch (error) {
        logger.error('API /transform error:', error)
        res.status(500).json({
          success: false,
          error: error.message
        })
      }
    })

    // ============ AGGREGATE ============
    
    router.post('/aggregate', async (req, res) => {
      try {
        const { data, operation, key } = req.body
        
        let result
        switch (operation) {
          case 'sum':
            result = DataAggregator.sum(data, key)
            break
          case 'average':
            result = DataAggregator.average(data, key)
            break
          case 'min':
            result = DataAggregator.min(data, key)
            break
          case 'max':
            result = DataAggregator.max(data, key)
            break
          case 'count':
            result = DataAggregator.frequency(data, key)
            break
          default:
            return res.status(400).json({
              success: false,
              error: `Unsupported operation: ${operation}`
            })
        }

        res.json({
          success: true,
          result
        })
      } catch (error) {
        logger.error('API /aggregate error:', error)
        res.status(500).json({
          success: false,
          error: error.message
        })
      }
    })

    // ============ VALIDATE ============
    
    router.post('/validate', async (req, res) => {
      try {
        const { data, rules } = req.body
        const { DataValidator } = await import('./DataValidator.js')
        
        const validator = rules ? new DataValidator(rules) : DataValidator.createMemberValidator()
        const result = validator.validate(data)

        res.json({
          success: true,
          valid: result.valid,
          errors: result.errors,
          errorCount: result.errorCount,
          dataCount: result.dataCount
        })
      } catch (error) {
        logger.error('API /validate error:', error)
        res.status(500).json({
          success: false,
          error: error.message
        })
      }
    })

    // ============ SESSION ============
    
    router.get('/session/:id', async (req, res) => {
      try {
        const { id } = req.params
        
        if (!this.#processors[id]) {
          return res.status(404).json({
            success: false,
            error: 'Session not found'
          })
        }

        const { processor, result } = this.#processors[id]
        res.json({
          success: true,
          count: result.length,
          headers: processor.getHeaders(),
          data: result
        })
      } catch (error) {
        logger.error('API /session error:', error)
        res.status(500).json({
          success: false,
          error: error.message
        })
      }
    })

    router.delete('/session/:id', async (req, res) => {
      try {
        const { id } = req.params
        
        if (id === 'all') {
          this.#processors = {}
          return res.json({
            success: true,
            message: 'All sessions cleared'
          })
        }

        if (this.#processors[id]) {
          delete this.#processors[id]
        }

        res.json({
          success: true,
          message: 'Session cleared'
        })
      } catch (error) {
        logger.error('API /session delete error:', error)
        res.status(500).json({
          success: false,
          error: error.message
        })
      }
    })

    return router
  }

  /**
   * Setup WebSocket server
   */
  #setupWebSocket() {
    this.#server = createServer(this.#app)
    this.#wss = new WebSocketServer({ server: this.#server })

    this.#wss.on('connection', (ws) => {
      this.#connections.add(ws)
      logger.info(`🔌 WebSocket client connected (${this.#connections.size} total)`)

      // Send initial connection message
      ws.send(JSON.stringify({
        type: 'connection',
        data: {
          status: 'connected',
          timestamp: new Date().toISOString(),
          clients: this.#connections.size
        }
      }))

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString())
          this.#handleWebSocketMessage(ws, data)
        } catch (error) {
          logger.error('WebSocket message error:', error)
          ws.send(JSON.stringify({
            type: 'error',
            data: { message: 'Invalid message format' }
          }))
        }
      })

      ws.on('close', () => {
        this.#connections.delete(ws)
        logger.info(`🔌 WebSocket client disconnected (${this.#connections.size} total)`)
      })

      ws.on('error', (error) => {
        logger.error('WebSocket error:', error)
        this.#connections.delete(ws)
      })
    })
  }

  /**
   * Handle WebSocket messages
   */
  #handleWebSocketMessage(ws, data) {
    switch (data.type) {
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', data: { timestamp: Date.now() } }))
        break
      
      case 'subscribe':
        ws.subscribed = data.channel
        ws.send(JSON.stringify({
          type: 'subscribed',
          data: { channel: data.channel }
        }))
        break
      
      case 'get:status':
        ws.send(JSON.stringify({
          type: 'status',
          data: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            connections: this.#connections.size,
            sessions: Object.keys(this.#processors).length
          }
        }))
        break
      
      default:
        ws.send(JSON.stringify({
          type: 'unknown',
          data: { message: `Unknown message type: ${data.type}` }
        }))
    }
  }

  /**
   * Broadcast message to all connected clients
   */
  #broadcast(message) {
    const payload = JSON.stringify(message)
    for (const client of this.#connections) {
      if (client.readyState === WebSocketServer.OPEN) {
        try {
          client.send(payload)
        } catch (error) {
          // Remove dead connection
          this.#connections.delete(client)
        }
      }
    }
  }

  /**
   * Setup error handling
   */
  #setupErrorHandling() {
    // 404 handler
    this.#app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: 'Not found',
        path: req.path
      })
    })

    // Global error handler
    this.#app.use((error, req, res, next) => {
      logger.error('Server error:', error)
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      })
    })

    // Unhandled rejection
    process.on('unhandledRejection', (error) => {
      logger.error('Unhandled rejection:', error)
    })

    // Uncaught exception
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception:', error)
      // Graceful shutdown
      this.#gracefulShutdown()
    })
  }

  /**
   * Graceful shutdown
   */
  #gracefulShutdown() {
    logger.info('🛑 Graceful shutdown initiated...')
    
    // Close WebSocket connections
    for (const client of this.#connections) {
      client.close()
    }
    this.#connections.clear()
    
    // Close server
    if (this.#server) {
      this.#server.close(() => {
        logger.info('✅ Server closed')
        process.exit(0)
      })
    }
    
    // Force exit after timeout
    setTimeout(() => {
      logger.warn('⚠️ Force exit after timeout')
      process.exit(1)
    }, 10000)
  }

  /**
   * Start the server
   */
  start() {
    if (this.#isRunning) {
      logger.warn('⚠️ Server is already running')
      return
    }

    const host = '0.0.0.0'
    this.#server.listen(this.#port, host, () => {
      this.#isRunning = true
      logger.info(`🚀 NewVexorion Server running on port ${this.#port}`)
      logger.info(`📁 Repository: ${config.getRepository()}`)
      logger.info(`🌐 Live Demo: ${config.getLiveDemo()}`)
      logger.info(`🔌 WebSocket: ws://${host}:${this.#port}`)
      logger.info(`📊 API: http://${host}:${this.#port}/api`)
    })

    // Handle shutdown signals
    process.on('SIGTERM', this.#gracefulShutdown.bind(this))
    process.on('SIGINT', this.#gracefulShutdown.bind(this))
  }

  /**
   * Stop the server
   */
  stop() {
    if (!this.#isRunning) {
      return
    }
    this.#gracefulShutdown()
  }

  /**
   * Get server status
   */
  getStatus() {
    return {
      running: this.#isRunning,
      port: this.#port,
      connections: this.#connections.size,
      sessions: Object.keys(this.#processors).length,
      uptime: process.uptime(),
      memory: process.memoryUsage()
    }
  }
}

// Export singleton
export const server = new Server()
export { Server }
