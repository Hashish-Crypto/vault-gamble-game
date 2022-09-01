import {
  _decorator,
  Component,
  Node,
  Prefab,
  instantiate,
  Sprite,
  math,
  find,
  director,
  Label,
  randomRangeInt,
  Button,
} from 'cc'
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

  @property({ type: Label })
  public prizeLabel: Label | null = null

  @property({ type: Node })
  public NumbersNode: Node[] | null = []

  @property({ type: Node })
  private loseUiNode: Node | null = null

  @property({ type: Node })
  private winUiNode: Node | null = null

  @property({ type: Node })
  private vaultUiNode: Node | null = null

  private _lightBulbQuantity: number = 60
  private _innerLightBulbCircle: ILightBulb[] = []
  private _innerLightBulbCircleRadius: number = 185
  private _outerLightBulbCircle: ILightBulb[] = []
  private _outerLightBulbCircleRadius: number = 205
  private _cycleTimer: number = 0
  private _lastActiveLightBulb: number = 0
  private _activeLightBulb: number = 0
  private _isClockwise: boolean = true
  private _round: number = 5
  private _persistentNode: PersistentNode | null = null
  private _gameOver: boolean = false

  onLoad() {
    this._persistentNode = find('PersistentNode').getComponent(PersistentNode)

    this._setPrize()

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
    this._round -= 1

    this.canvasNode.on(Node.EventType.TOUCH_START, this._onTouchScreen, this)
    this.loseUiNode.getChildByName('LoseMenuButton').on(Button.EventType.CLICK, this._returnToMenu, this)
    this.winUiNode.getChildByName('GetPrizeButton').on(Button.EventType.CLICK, this._claimPrize, this)
    this.winUiNode.getChildByName('OpenVaultButton').on(Button.EventType.CLICK, this._openVault, this)
    this.vaultUiNode.getChildByName('GetPrizeButton').on(Button.EventType.CLICK, this._returnToMenu, this)
  }

  update(deltaTime: number) {
    if (!this._gameOver) {
      this._cycleTimer += deltaTime
      if (this._cycleTimer >= 0.035 / this._persistentNode.speed) {
        this._cycleTimer = 0
        this._lastActiveLightBulb = this._activeLightBulb

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

    if (this._round > 1) {
      for (let i = 1; i <= this._round; i += 1) {
        for (let j = 0; j < this._round; j += 1) {
          const index = Math.trunc((this._lightBulbQuantity * i) / this._round) - 1 - j

          this._setLightBulbColor(this._innerLightBulbCircle[index], LightBulbColor.RED)
          this._setLightBulbColor(this._outerLightBulbCircle[index], LightBulbColor.RED)
        }
      }
    } else if (this._round === 1) {
      for (let i = 1; i <= this._round; i += 1) {
        for (let j = 0; j < 2; j += 1) {
          const index = Math.trunc((this._lightBulbQuantity * i) / this._round) - 1 - j

          this._setLightBulbColor(this._innerLightBulbCircle[index], LightBulbColor.RED)
          this._setLightBulbColor(this._outerLightBulbCircle[index], LightBulbColor.RED)
        }
      }
    }
  }

  private _unlockNumber() {
    this.NumbersNode[this._round].getChildByName('Background').getComponent(Sprite).color = new math.Color(
      15,
      25,
      35,
      255
    )
    this.NumbersNode[this._round].getChildByName('Label').getComponent(Label).string = String(randomRangeInt(0, 10))

    this._round -= 1
    if (this._round === -1) {
      this._stopGame()
      this.winUiNode.active = true
      return
    }

    this._resumeGame()
  }

  private _setPrize() {
    const prizeValue = 'Prize: HC$' + this._persistentNode.prize.toFixed(2)
    this.prizeLabel.string = prizeValue
    this.winUiNode.getChildByName('PrizeStateLabel').getComponent(Label).string = prizeValue
  }

  private _onTouchScreen() {
    this._stopGame()
    if (this._innerLightBulbCircle[this._lastActiveLightBulb].color === LightBulbColor.RED) {
      this._setGameRound()
      this._unlockNumber()
    } else if (this._innerLightBulbCircle[this._lastActiveLightBulb].color === LightBulbColor.GREEN) {
      this._stopGame()
      this._persistentNode.balance -= this._persistentNode.bet
      this.loseUiNode.active = true
    }

    this._isClockwise = !this._isClockwise
  }

  private _stopGame() {
    this._gameOver = true
    this.canvasNode.off(Node.EventType.TOUCH_START, this._onTouchScreen, this)
  }

  private _resumeGame() {
    this._gameOver = false
    this.canvasNode.on(Node.EventType.TOUCH_START, this._onTouchScreen, this)
  }

  private _returnToMenu() {
    director.loadScene('Menu')
  }

  private _claimPrize() {
    this._persistentNode.balance += this._persistentNode.prize
    this._returnToMenu()
  }

  private _openVault() {
    this.winUiNode.active = false

    const randomNumber = randomRangeInt(0, 10)
    if (randomNumber < 3) {
      this._persistentNode.balance += this._persistentNode.prize * 3
      this.vaultUiNode.getChildByName('PrizeStateLabel').getComponent(Label).string =
        'Prize: HC$' + (this._persistentNode.prize * 3).toFixed(2)
      this.vaultUiNode.active = true
    } else {
      this._persistentNode.balance -= this._persistentNode.bet
      this.loseUiNode.getChildByName('LooseHintLabel').getComponent(Label).string =
        'The safe is empty,\ngood luck next time.'
      this.loseUiNode.active = true
    }
  }
}
