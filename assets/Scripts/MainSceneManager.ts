import { _decorator, Component, Node, Prefab, instantiate, Sprite, math, find } from 'cc'
import { PersistentNode } from './PersistentNode'

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

  @property({ type: Node })
  private canvasNode: Node | null = null

  private _lightBulbQuantity: number = 60
  private _innerLightBulbCircle: ILightBulb[] = []
  private _innerLightBulbCircleRadius: number = 185
  private _outerLightBulbCircle: ILightBulb[] = []
  private _outerLightBulbCircleRadius: number = 205
  private _cycleTimer: number = 0
  private _activeLightBulb: number = 0
  private _isClockwise: boolean = true
  private _round: number = 5
  private _persistentNode: PersistentNode | null = null

  onLoad() {
    this._persistentNode = find('PersistentNode').getComponent(PersistentNode)

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

    this._setGameRound()

    this.canvasNode.on(Node.EventType.TOUCH_START, this._onTouchScreen, this)
  }

  update(deltaTime: number) {
    this._cycleTimer += deltaTime
    if (this._cycleTimer >= 0.028 / this._persistentNode.speed) {
      this._cycleTimer = 0

      if (this._isClockwise) {
        if (this._activeLightBulb > 0) {
          if (this._innerLightBulbCircle[this._activeLightBulb - 1].color === LightBulbColor.GREEN) {
            this._setLightBulbColor(this._innerLightBulbCircle[this._activeLightBulb - 1], LightBulbColor.GREEN)
            this._setLightBulbColor(this._outerLightBulbCircle[this._activeLightBulb - 1], LightBulbColor.GREEN)
          } else if (this._innerLightBulbCircle[this._activeLightBulb - 1].color === LightBulbColor.RED) {
            this._setLightBulbColor(this._innerLightBulbCircle[this._activeLightBulb - 1], LightBulbColor.RED)
            this._setLightBulbColor(this._outerLightBulbCircle[this._activeLightBulb - 1], LightBulbColor.RED)
          }
        } else if (this._activeLightBulb === 0) {
          if (this._innerLightBulbCircle[this._lightBulbQuantity - 1].color === LightBulbColor.GREEN) {
            this._setLightBulbColor(this._innerLightBulbCircle[this._lightBulbQuantity - 1], LightBulbColor.GREEN)
            this._setLightBulbColor(this._outerLightBulbCircle[this._lightBulbQuantity - 1], LightBulbColor.GREEN)
          } else if (this._innerLightBulbCircle[this._lightBulbQuantity - 1].color === LightBulbColor.RED) {
            this._setLightBulbColor(this._innerLightBulbCircle[this._lightBulbQuantity - 1], LightBulbColor.RED)
            this._setLightBulbColor(this._outerLightBulbCircle[this._lightBulbQuantity - 1], LightBulbColor.RED)
          }
        }

        this._setLightBulbColor(this._innerLightBulbCircle[this._activeLightBulb], LightBulbColor.BLUE)
        this._setLightBulbColor(this._outerLightBulbCircle[this._activeLightBulb], LightBulbColor.BLUE)

        this._activeLightBulb += 1
        if (this._activeLightBulb > 59) {
          this._activeLightBulb = 0
        }
      } else if (!this._isClockwise) {
        if (this._activeLightBulb < 59) {
          if (this._innerLightBulbCircle[this._activeLightBulb + 1].color === LightBulbColor.GREEN) {
            this._setLightBulbColor(this._innerLightBulbCircle[this._activeLightBulb + 1], LightBulbColor.GREEN)
            this._setLightBulbColor(this._outerLightBulbCircle[this._activeLightBulb + 1], LightBulbColor.GREEN)
          } else if (this._innerLightBulbCircle[this._activeLightBulb + 1].color === LightBulbColor.RED) {
            this._setLightBulbColor(this._innerLightBulbCircle[this._activeLightBulb + 1], LightBulbColor.RED)
            this._setLightBulbColor(this._outerLightBulbCircle[this._activeLightBulb + 1], LightBulbColor.RED)
          }
        } else if (this._activeLightBulb === 59) {
          if (this._innerLightBulbCircle[0].color === LightBulbColor.GREEN) {
            this._setLightBulbColor(this._innerLightBulbCircle[0], LightBulbColor.GREEN)
            this._setLightBulbColor(this._outerLightBulbCircle[0], LightBulbColor.GREEN)
          } else if (this._innerLightBulbCircle[0].color === LightBulbColor.RED) {
            this._setLightBulbColor(this._innerLightBulbCircle[0], LightBulbColor.RED)
            this._setLightBulbColor(this._outerLightBulbCircle[0], LightBulbColor.RED)
          }
        }

        this._setLightBulbColor(this._innerLightBulbCircle[this._activeLightBulb], LightBulbColor.BLUE)
        this._setLightBulbColor(this._outerLightBulbCircle[this._activeLightBulb], LightBulbColor.BLUE)

        this._activeLightBulb -= 1
        if (this._activeLightBulb < 0) {
          this._activeLightBulb = 59
        }
      }
    }
  }

  private _setLightBulbColor(lightBulb: ILightBulb, color: LightBulbColor) {
    if (color === LightBulbColor.GREEN) {
      lightBulb.node.getChildByName('BrightLight').active = false
      lightBulb.node.getChildByName('Background').getComponent(Sprite).color = new math.Color(0, 127, 0, 255)
      lightBulb.node.getChildByName('InnerLight').getChildByName('Background').getComponent(Sprite).color =
        new math.Color(0, 191, 0, 255)
      lightBulb.color = LightBulbColor.GREEN
    } else if (color === LightBulbColor.RED) {
      lightBulb.node.getChildByName('BrightLight').active = false
      lightBulb.node.getChildByName('Background').getComponent(Sprite).color = new math.Color(127, 0, 0, 255)
      lightBulb.node.getChildByName('InnerLight').getChildByName('Background').getComponent(Sprite).color =
        new math.Color(191, 0, 0, 255)
      lightBulb.color = LightBulbColor.RED
    } else if (color === LightBulbColor.BLUE) {
      lightBulb.node.getChildByName('BrightLight').active = true
      lightBulb.node.getChildByName('Background').getComponent(Sprite).color = new math.Color(179, 179, 255, 255)
      lightBulb.node.getChildByName('InnerLight').getChildByName('Background').getComponent(Sprite).color =
        new math.Color(230, 230, 255, 255)
    }
  }

  private _setGameRound() {
    for (let i = 0; i < this._lightBulbQuantity; i += 1) {
      this._setLightBulbColor(this._innerLightBulbCircle[i], LightBulbColor.GREEN)
      this._setLightBulbColor(this._outerLightBulbCircle[i], LightBulbColor.GREEN)
    }

    for (let i = 1; i <= this._round; i += 1) {
      for (let j = 0; j < this._round; j += 1) {
        const index = Math.trunc((this._lightBulbQuantity * i) / this._round) - 1 - j

        this._setLightBulbColor(this._innerLightBulbCircle[index], LightBulbColor.RED)
        this._setLightBulbColor(this._outerLightBulbCircle[index], LightBulbColor.RED)
      }
    }

    this._round -= 1
  }

  private _onTouchScreen() {
    if (this._innerLightBulbCircle[this._activeLightBulb].color === LightBulbColor.RED) {
      this._setGameRound()
    }

    this._isClockwise = !this._isClockwise
  }
}
