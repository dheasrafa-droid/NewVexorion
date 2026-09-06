/**
 * Example script for running Attribute, AttributeManager, and EventDispatcher.
 * Demonstrates reactive state management and event handling.
 * 
 * @project NewVexorion
 * @author Prasetyo Bayu Widodo
 * @see {@link https://github.com/dheasrafa-droid/NewVexorion}
 * @see {@link https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/}
 */
import { Attribute, AttributeManager, EventDispatcher } from '../src/index.js'

console.log('🚀 Starting Attributes & Events Example...\n')

// 1. Single Attribute with Change Tracking
console.log('--- 1. Attribute: Change Tracking ---')
const nameAttr = Attribute.string('username', 'John Doe')
console.log(`Initial value: ${nameAttr.get()}`)
console.log(`Is dirty: ${nameAttr.isDirty()}`)

nameAttr.onChange((newValue) => {
  console.log(`  🔔 Attribute changed to: "${newValue}"`)
})

nameAttr.set('Jane Doe')
console.log(`Is dirty after set: ${nameAttr.isDirty()}`)
nameAttr.markClean()
console.log(`Is dirty after markClean: ${nameAttr.isDirty()}`)

// 2. Typed Attributes
console.log('\n--- 2. Typed Attributes ---')
const countAttr = Attribute.number('count', 10)
const activeAttr = Attribute.boolean('active', true)
const tagsAttr = Attribute.array('tags', ['alpha', 'beta'])

console.log(`Number attribute: ${countAttr.get()} (${typeof countAttr.get()})`)
console.log(`Boolean attribute: ${activeAttr.get()} (${typeof activeAttr.get()})`)
console.log(`Array attribute: ${tagsAttr.get().join(', ')}`)

// 3. AttributeManager
console.log('\n--- 3. AttributeManager: State Collection ---')
const manager = new AttributeManager({
  projectName: 'NewVexorion',
  version: '2.0.0',
  debug: false
})

manager.onAnyChange((name, value) => {
  console.log(`  🔔 Manager property "${name}" changed to:`, value)
})

manager.set('version', '2.1.0')
manager.set('debug', true)
console.log(`Dirty attributes: ${manager.getDirtyAttributes().join(', ')}`)
console.log('Full state as object:', manager.toObject())

// 4. EventDispatcher
console.log('\n--- 4. EventDispatcher: Observer Pattern ---')
const dispatcher = new EventDispatcher()

dispatcher.on('dataLoaded', (event) => {
  console.log(`  📡 Event "dataLoaded" received! Count: ${event.count}`)
})

dispatcher.once('init', (event) => {
  console.log(`  ⚡ One-time event "init" fired: ${event.message}`)
})

dispatcher.emit('init', { message: 'System ready' })
dispatcher.emit('init', { message: 'This should not fire' }) // Won't fire

dispatcher.emit('dataLoaded', { count: 42 })

console.log('\n🎉 Attributes & Events example completed successfully!')
