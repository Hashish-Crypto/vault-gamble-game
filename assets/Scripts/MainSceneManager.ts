import { _decorator, Component, Node, Prefab, instantiate } from 'cc'

const { ccclass, property } = _decorator

@ccclass('MainSceneManager')
export class MainSceneManager extends Component {
  @property({ type: Node })
  private lightBulbRef: Node | null = null

  @property({ type: Prefab })
  private lightBulbPrefab: Prefab | null = null

  private _innerLightBulbCircle: Node[] = []

  onLoad() {
    this.lightBulbRef.addChild(instantiate(this.lightBulbPrefab))
  }

  // update(deltaTime: number) {}
}
