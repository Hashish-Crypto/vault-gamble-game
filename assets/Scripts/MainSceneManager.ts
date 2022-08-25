import { _decorator, Component, Node, Prefab, instantiate, Sprite, math } from 'cc'

const { ccclass, property } = _decorator

enum LightBulbColor {
  GREEN,
  RED,
  PURPLE,
}

interface ILightBulb {
  node: Node
  color: LightBulbColor
}

@ccclass('MainSceneManager')
export class MainSceneManager extends Component {
  @property({ type: Node })
  private lightBulbRef: Node | null = null

  @property({ type: Prefab })
  private lightBulbPrefab: Prefab | null = null

  private _lightBulbQuantity: number = 60
  private _innerLightBulbCircle: ILightBulb[] = []
  private _innerLightBulbCircleRadius: number = 185
  private _outerLightBulbCircle: ILightBulb[] = []
  private _outerLightBulbCircleRadius: number = 205

  onLoad() {
    for (let i = 0; i < this._lightBulbQuantity; i += 1) {
      this._innerLightBulbCircle[i] = {
        node: instantiate(this.lightBulbPrefab),
        color: LightBulbColor.GREEN,
      }
      let x = (Math.cos((Math.PI * i) / (this._lightBulbQuantity / 2)) + 8 - 8) * this._innerLightBulbCircleRadius
      let y = (Math.sin((Math.PI * i) / (this._lightBulbQuantity / 2)) + 8 - 8) * this._innerLightBulbCircleRadius
      this._innerLightBulbCircle[i].node.setPosition(x, y)
      this.lightBulbRef.addChild(this._innerLightBulbCircle[i].node)

      this._outerLightBulbCircle[i] = {
        node: instantiate(this.lightBulbPrefab),
        color: LightBulbColor.GREEN,
      }
      x = (Math.cos((Math.PI * i) / (this._lightBulbQuantity / 2)) + 8 - 8) * this._outerLightBulbCircleRadius
      y = (Math.sin((Math.PI * i) / (this._lightBulbQuantity / 2)) + 8 - 8) * this._outerLightBulbCircleRadius
      this._outerLightBulbCircle[i].node.setPosition(x, y)
      this.lightBulbRef.addChild(this._outerLightBulbCircle[i].node)
    }

    for (let i = 1; i <= 5; i += 1) {
      for (let j = 0; j < 5; j += 1) {
        const index = Math.trunc((this._lightBulbQuantity * i) / 5) - 1 - j
        this._innerLightBulbCircle[index].node.getChildByName('Background').getComponent(Sprite).color = new math.Color(
          127,
          0,
          0,
          255
        )
        this._innerLightBulbCircle[index].node
          .getChildByName('InnerLight')
          .getChildByName('Background')
          .getComponent(Sprite).color = new math.Color(255, 0, 0, 255)
        this._innerLightBulbCircle[i].color = LightBulbColor.RED
        this._outerLightBulbCircle[index].node.getChildByName('Background').getComponent(Sprite).color = new math.Color(
          127,
          0,
          0,
          255
        )
        this._outerLightBulbCircle[index].node
          .getChildByName('InnerLight')
          .getChildByName('Background')
          .getComponent(Sprite).color = new math.Color(255, 0, 0, 255)
        this._innerLightBulbCircle[i].color = LightBulbColor.RED
      }
    }
  }

  // update(deltaTime: number) {}
}
