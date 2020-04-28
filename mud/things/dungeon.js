const RedisGraphShim = require('../data/redis-graph-shim')
const Queries = require('../data/queries')

const Room = require('./room')
const Door = require('./door')
const User = require('./user')

class Dungeon {

  open() {
    this.shim = new RedisGraphShim()
    this.shim.open('dungeon')
  }

  close() {
    this.shim.close()
  }

  async fetchRoomList() {
    let valueSet = await this.shim.executeAndReturnMany(Queries.FETCH_ALL_ROOMS)
    return valueSet.map(values => this.roomFromValues(values))
  }

  async fetchUser(id) {
    let values = await this.shim.executeAndReturnSingle(Queries.FETCH_USER, {id})
    return this.userFromValues(values)
  }

  async createUser(){
    let values = await this.shim.executeAndReturnSingle(Queries.CREATE_USER)
    return this.userFromValues(values)
  }

  async fetchRoom(id) {
    let values = await this.shim.executeAndReturnSingle(Queries.FETCH_ROOM, {id})
    return this.roomFromValues(values)
  }

  async fetchOrCreateHub() {
    let values = await this.shim.executeAndReturnSingle(Queries.FETCH_OR_CREATE_HUB,
      { name: 'The Hub', description: 'Huge hub is huge' })
    return this.roomFromValues(values)
  }

  async createRoom(name) {
    let values = await this.shim.executeAndReturnSingle(Queries.CREATE_ROOM,
      { name, description: 'This is a room.' })
    return this.roomFromValues(values)
  }

  async createPortal(name) {
    let values = await this.shim.executeAndReturnSingle(Queries.CREATE_PORTAL,
      { name, description: 'This is a portal.' })
    return this.roomFromValues(values)
  }

  async createDoor({ name, from, to }) {
    let values = await this.shim.executeAndReturnSingle(Queries.CREATE_DOOR,
      { name, description: 'This is a door.', from, to })
    return this.doorFromValues(values)
  }

  async updateRoom(id, name, description) {
    await this.shim.execute(Queries.UPDATE_ROOM, { id, name, description })
  }

  roomFromValues(values) {
    return new Room(this, {
      id: values[0],
      name: values[1],
      description: values[2]
    })
  }

  userFromValues(values) {
    if(values!=null){
      return new User(this, {
        id: values[0]
      })
    } else {
      return null
    }
  }

  doorFromValues(values) {
    return new Door(this, {
      id: values[0],
      name: values[1],
      description: values[2],
      from: values[3],
      to: values[4]
    })
  }
}

module.exports = Dungeon
