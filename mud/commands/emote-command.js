class EmoteCommand {
  execute(stream, message) {
    let [ _, emote ] = message.match(/^\/emote (.*)$/)

    stream.send(`You ${emote}`)
    stream.send("")
  }

}

module.exports = EmoteCommand