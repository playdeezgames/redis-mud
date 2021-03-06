const chai = require('chai')
const bluebird = require('bluebird')
let expect = chai.expect

const sinon = require('sinon')
const sinonChai = require('sinon-chai')

chai.use(sinonChai)

const Session = require('../mud/session')

const WebSocket = require('ws')
const Context = require('../mud/context')
const Prompt = require('../mud/prompt')
const User = require('../mud/things/user')
const CommandProcessor = require('../mud/commands/command-processor')

describe("Session", function() {
  beforeEach(function() {
    sinon.stub(Context.prototype, 'start')
    sinon.stub(CommandProcessor.prototype, 'processMessage')
    sinon.stub(Prompt.prototype, 'fetchPrompt')
    this.websocket = sinon.createStubInstance(WebSocket)

    this.subject = new Session(this.websocket)
  })

  afterEach(function() {
    sinon.restore()
  })

  context("when started", function() {
    beforeEach(function() {
      Prompt.prototype.fetchPrompt.returns(["some", "prompt"])
      return this.subject.start()
    })

    it("starts the context", function() {
      expect(Context.prototype.start).to.have.been.called
    })

    it("it sends the message of the day and the prompt", function() {
      expect(this.websocket.send.firstCall).to.have.been.calledWith("{\"status\":\"identify\"}")
    })

    describe("#processMessage", function() {
      beforeEach(async function() {
        this.websocket.send.resetHistory()
        this.user = new User(null,{ id: '1', name: 'one'})
        CommandProcessor.prototype.processMessage.returns("test")
        sinon.stub(Context.prototype, 'authenticate').usingPromise(bluebird.Promise).resolves(this.user)
        await this.subject.processMessage("{\"auth\":\"1\",\"message\":\"some message\"}")
      })

      it("invokes the message processor", function() {
        expect(CommandProcessor.prototype.processMessage)
          .to.have.been.calledWith(this.subject.context, this.user, "{\"auth\":\"1\",\"message\":\"some message\"}")
      })

      it("returns the response to the web socket", function() {
        expect(this.websocket.send.firstCall).to.have.been.calledWith("\"test\"")
      })
    })
  })
})
