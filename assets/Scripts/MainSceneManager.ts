import { _decorator, Component, Node, Prefab, instantiate, Sprite, math } from 'cc'

const { ccclass, property } = _decorator

enum LightBulbColor {
  GREEN,
  RED,
  BLUE,
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
  private _cycleTimer: number = 0
  private _activeLightBulb: number = 0

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

        this._setLightBulbColor(this._innerLightBulbCircle[index].node, LightBulbColor.RED)
        this._setLightBulbColor(this._outerLightBulbCircle[index].node, LightBulbColor.RED)
        this._innerLightBulbCircle[index].color = LightBulbColor.RED
        this._outerLightBulbCircle[index].color = LightBulbColor.RED
      }
    }
  }

  update(deltaTime: number) {
    this._cycleTimer += deltaTime
    if (this._cycleTimer >= 0.025) {
      this._cycleTimer = 0

      if (this._activeLightBulb > 0) {
        if (this._innerLightBulbCircle[this._activeLightBulb - 1].color === LightBulbColor.GREEN) {
          this._setLightBulbColor(this._innerLightBulbCircle[this._activeLightBulb - 1].node, LightBulbColor.GREEN)
          this._setLightBulbColor(this._outerLightBulbCircle[this._activeLightBulb - 1].node, LightBulbColor.GREEN)
        } else if (this._innerLightBulbCircle[this._activeLightBulb - 1].color === LightBulbColor.RED) {
          this._setLightBulbColor(this._innerLightBulbCircle[this._activeLightBulb - 1].node, LightBulbColor.RED)
          this._setLightBulbColor(this._outerLightBulbCircle[this._activeLightBulb - 1].node, LightBulbColor.RED)
        }
      } else if (this._activeLightBulb === 0) {
        if (this._innerLightBulbCircle[this._lightBulbQuantity - 1].color === LightBulbColor.GREEN) {
          this._setLightBulbColor(this._innerLightBulbCircle[this._lightBulbQuantity - 1].node, LightBulbColor.GREEN)
          this._setLightBulbColor(this._outerLightBulbCircle[this._lightBulbQuantity - 1].node, LightBulbColor.GREEN)
        } else if (this._innerLightBulbCircle[this._lightBulbQuantity - 1].color === LightBulbColor.RED) {
          this._setLightBulbColor(this._innerLightBulbCircle[this._lightBulbQuantity - 1].node, LightBulbColor.RED)
          this._setLightBulbColor(this._outerLightBulbCircle[this._lightBulbQuantity - 1].node, LightBulbColor.RED)
        }
      }

      this._setLightBulbColor(this._innerLightBulbCircle[this._activeLightBulb].node, LightBulbColor.BLUE)
      this._setLightBulbColor(this._outerLightBulbCircle[this._activeLightBulb].node, LightBulbColor.BLUE)

      this._activeLightBulb += 1
      if (this._activeLightBulb > 59) {
        this._activeLightBulb = 0
      }
    }
  }

  private _setLightBulbColor(lightBulbNode: Node, color: LightBulbColor) {
    if (color === LightBulbColor.GREEN) {
      lightBulbNode.getChildByName('BrightLight').active = false
      lightBulbNode.getChildByName('Background').getComponent(Sprite).color = new math.Color(0, 127, 0, 255)
      lightBulbNode.getChildByName('InnerLight').getChildByName('Background').getComponent(Sprite).color =
        new math.Color(0, 255, 0, 255)
    } else if (color === LightBulbColor.RED) {
      lightBulbNode.getChildByName('BrightLight').active = false
      lightBulbNode.getChildByName('Background').getComponent(Sprite).color = new math.Color(127, 0, 0, 255)
      lightBulbNode.getChildByName('InnerLight').getChildByName('Background').getComponent(Sprite).color =
        new math.Color(255, 0, 0, 255)
    } else if (color === LightBulbColor.BLUE) {
      lightBulbNode.getChildByName('BrightLight').active = true
      lightBulbNode.getChildByName('Background').getComponent(Sprite).color = new math.Color(179, 179, 255, 255)
      lightBulbNode.getChildByName('InnerLight').getChildByName('Background').getComponent(Sprite).color =
        new math.Color(230, 230, 255, 255)
    }
  }
}
