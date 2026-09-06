/**
 * PM2 Configuration for NewVexorion
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
export default {
  apps: [{
    name: 'newvexorion',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    autorestart: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 8080
    },
    error_file: 'logs/pm2-error.log',
    out_file: 'logs/pm2-out.log',
    log_file: 'logs/pm2-combined.log',
    time: true,
    merge_logs: true,
    log_type: 'json',
    kill_timeout: 5000,
    listen_timeout: 3000,
    shutdown_with_message: true
  }]
}
