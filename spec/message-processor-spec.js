const chai = require('chai')
let expect = chai.expect

const sinon = require('sinon')
const sinonChai = require('sinon-chai')

chai.use(sinonChai)

const MessageProcessor = require('../mud/message-processor')

const Say = require('../mud/commands/say-command')
const Emote = require('../mud/commands/emote-command')
const Look = require('../mud/commands/look-command')
const Describe = require('../mud/commands/describe-command')
const Rename = require('../mud/commands/rename-command')
const Create = require('../mud/commands/create-command')
const Error = require('../mud/commands/error-command')

const Context = require('../mud/context')

describe("MessageProcessor", function() {

  beforeEach(function() {
    this.context = sinon.createStubInstance(Context)
    this.subject = new MessageProcessor()
  })

  let scenarios = [
    { clazz: Say, clazzName: 'Say', text: "I have a dream!" },
    { clazz: Emote, clazzName: 'Emote', text: "/emote is eating food!" },
    { clazz: Look, clazzName: 'Look', text: "/look" },
    { clazz: Describe, clazzName: 'Describe', text: "/describe room It has a view." },
    { clazz: Rename, clazzName: 'Rename', text: "/rename room Room with a View" },
    { clazz: Create, clazzName: 'Create', text: "/create room The Back Room" },
    { clazz: Error, clazzName: 'Error', text: "/error is not a valid command." },
  ]

  scenarios.forEach(scenario => {
    let { clazz, clazzName, text } = scenario

    context(`when processing a ${clazzName} command`, function() {
      beforeEach(function() {
        sinon.stub(clazz.prototype, 'execute')
        clazz.prototype.execute.returns("The command did a thing!")
    
        this.response = this.subject.processMessage(this.context, text)
      })
  
      afterEach(function() {
        sinon.restore()
      })
  
      it("executes the command", function() {
        expect(clazz.prototype.execute).to.have.been.calledWith(this.context, text)
      })
  
      it("returns the response of the command", function() {
        expect(this.response).to.have.ordered.members(["The command did a thing!"])
      })
    })
  })
})
