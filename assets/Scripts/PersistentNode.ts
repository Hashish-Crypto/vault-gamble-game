import { _decorator, Component, director } from 'cc'

const { ccclass } = _decorator

@ccclass('PersistentNode')
export class PersistentNode extends Component {
  public balance: number = 100
  public bet: number | null = null
  public prize: number | null = null
  public speed: number | null = null
  public betMultiplier: number | null = null

  onLoad() {
    director.addPersistRootNode(this.node)
  }
}
