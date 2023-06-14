import AudioGame from './AudioGame'

export default class GameFacade {
  public audio: AudioGame | null = null

  public microIsNeeded() {
    if (this.audio) return
    this.audio = new AudioGame()
  }

  public kill() {
    console.log("GameFacade kill")
    if (this.audio) {
      this.audio.kill()
      this.audio = null
    }
  }
}
