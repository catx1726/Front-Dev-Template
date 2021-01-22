/* 
为什么这么引用  
https://github.com/juliangarnier/anime/issues/527
https://stackoverflow.com/questions/44217047/anime-js-not-working-in-ionic-3-project
*/
import anime from 'animejs/lib/anime.es';

import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ButtonOption, HintTools } from 'src/providers/HintTools';
import { GiftsLevelInfoTypes } from 'src/model/scratch-card';
@Component({
  selector: 'app-scratch-card-component',
  templateUrl: './scratch-card-component.component.html',
  styleUrls: ['./scratch-card-component.component.scss']
})
export class ScratchCardComponentComponent implements OnInit {
  @Input() parentAllData;
  @Input() curCardData;

  constructor(private el: ElementRef, public hint: HintTools) {}

  public CONSOLE_MSG_INFO = 'scratch-card-component';

  public DOC = document;

  public cardScratchLock = false; // 检测卡片是否刮完

  public uList = []; // 在管理员选中卡片之后，将用户写入该对象，然后循环

  public canvas: any = {};
  public ctx: any = {};
  public card: any;
  public width;
  public height;
  public content: any = {};
  public isDrawing: any;
  public lastPoint: any;
  public brush = new Image();
  public percentage = 60; // 存刮到多少比例得时候直接显示全部

  public clickMaskList: any;
  public globalTimeout: any;

  public pressConfig = { duration: 1000 };
  public removeDomConfig = { duration: 1000 };

  ngOnInit() {
    console.log(`${this.CONSOLE_MSG_INFO} ngOnInit!`);
  }

  ionViewDidEnter() {
    console.log(`${this.CONSOLE_MSG_INFO} ionViewDidEnter!`);
  }

  ngAfterViewInit() {
    this.handleClickMaskEvent();
    console.log(`${this.CONSOLE_MSG_INFO} ngAfterViewInit!`);
  }

  ngOnDestroy() {
    console.log(`${this.CONSOLE_MSG_INFO} ngOnDestroy!`);
  }

  /* 检测当前的DOM，是否是 .click_mask，消除穿透现象 */
  handleCheckCurDomIsClickMask(e) {
    let curDOM: Element = e.srcElement || e.target;
    return curDOM.className.includes('click_mask');
  }
  handleClickMaskEvent() {
    /*
    1. 给 clickMaskList 加监听 
    2. 长按 1s 后选择 dom，选中的样式提示 
    3. 无关 dom 卸载，且移除 clickMask  
    移除其他DOM，注册当前 Canvas(handleDefaultEvent()) 
    */
    let _that = this;
    this.clickMaskList = this.DOC.querySelectorAll('.click_mask');
    this.clickMaskList.forEach((item: GlobalEventHandlers) => {
      item.onmousedown = function (e) {
        window.clearTimeout(_that.globalTimeout);
        // 非 click_mask 不执行
        if (!_that.handleCheckCurDomIsClickMask(e)) return;
        // 非法禁止
        if (_that.parentAllData.invalidLock) {
          _that.parentAllData.onChangeNumbers(false);
          return;
        }
        _that.handleMouseLongPressEvent(e);
      };

      item.onmouseup = function (e) {
        window.clearTimeout(_that.globalTimeout);
        // 非法禁止
        if (_that.parentAllData.invalidLock) return;
        _that.handleMouseUpEvent(e);
      };
    });
    console.log(`${_that.CONSOLE_MSG_INFO} handleClickMaskEvent!`);
  }

  handleMouseLongPressEvent(e) {
    console.log(`${this.CONSOLE_MSG_INFO} handleMouseLongPressEvent!`, e);
    let curDom: Element = e.target || e.srcElement;
    curDom.classList.add('press');
    this.handleChooseCardEvent(curDom);
  }

  handleMouseUpEvent(e) {
    console.log(`${this.CONSOLE_MSG_INFO} handleMouseUpEvent!`);
    let curDom: Element = e.target || e.srcElement;
    curDom.classList.remove('press');
  }

  /* 
  OK
  删除其他 DOM 且 删除当前 card 的 clickMask 
  利用 anime.js 将其移除边界，然后设置成 display:none 后删除，尽量避免回流
  加一个 clickMask 的原因是，canvas 已经写了 mouseUp 和 mouseMove 等一些列监听
   */
  handleChooseCardEvent(curDom) {
    try {
      let parentDom = curDom.parentElement || curDom.parentNode;
      this.globalTimeout = window.setTimeout(() => {
        this.handleCleanElseClickEffect();
        // 在最外层加上 active 类，方便后面删除元素
        parentDom.classList.toggle('active');
        curDom.classList.toggle('active');
        let cardList = this.DOC.querySelectorAll('.card_container');
        let needMoveCard = this.handleFilterDom(cardList, 'active');
        this.handleMoveDom(needMoveCard);
        // this.handleDeleteDom(needMoveCard);
        console.log(`${this.CONSOLE_MSG_INFO} handleChooseCardEvent!`, needMoveCard);
      }, this.pressConfig.duration);
    } catch (error) {
      console.log(`${this.CONSOLE_MSG_INFO} handleChooseCardEvent Error!`, error);
    }
  }

  /* 过滤掉当前选中的元素 */
  handleFilterDom(list, filterOption) {
    let pureList = [];
    list.forEach((item) => {
      if (!item.classList.toString().includes(filterOption)) {
        pureList.push(item);
      }
    });
    return pureList;
  }

  /* 移动无关的DOM */
  async handleMoveDom(domList?) {
    let _that = this;
    anime({
      targets: domList,
      translateX: '100vw',
      duration: this.removeDomConfig.duration,
      opacity: 0,
      complete: function (anim) {
        console.log(`${this.CONSOLE_MSG_INFO} handleMoveDom anime complete!`);
        // 删除 无关的 card
        _that.handleDeleteDom(domList);
        // 删除 当前card 的 clickMask
        _that.handleCurChoseDom();
        // 触发 canvas 监听方法
        _that.handleDefaultEvent();
        // OK 拉取中奖用户，且将中奖用户赋给负责循环的变量，放这里是因为将风险降低，毕竟都要刮卡了
        _that.handleLoopArr();
      }
    });
    console.log(`${this.CONSOLE_MSG_INFO} handleMoveDom!`);
  }

  /* 将中奖用户赋给负责循环的变量 */
  async handleLoopArr() {
    try {
      // 调用父组件中的拉取随机用户方法
      await this.parentAllData.getLotteryUser();
      let curActiveUListBox = this.DOC.querySelector('.card_container.active .user-list');
      let fragment = this.DOC.createDocumentFragment();
      this.parentAllData.scratchWinUserList.forEach((i: GiftsLevelInfoTypes) => {
        const li = this.DOC.createElement('li');
        /* 
       这里有个问题，因为angular 的样式是局部的，所以这样写无法成功显示样式 
       解决方法：
       1. 将其CSS样式提到全局中去，但是要注意 组合，如 .gb .pg .scratch-compoent .ulist .item
          指定清楚在那个页面的容器中使用，如果不指定那么在以后会很容易出问题
       2. 直接写 css 在 TS 代码中，不太美观...
       */
        li.classList.add('item');
        li.innerHTML = i.Name;
        fragment.appendChild(li);
      });
      curActiveUListBox.appendChild(fragment);
      console.log(`${this.CONSOLE_MSG_INFO} handleLoopArr:`, curActiveUListBox);
    } catch (error) {
      console.log(`${this.CONSOLE_MSG_INFO} handleLoopArr error!`, error);
    }
  }

  /* 处理当前 card 的样式 */
  handleCurChoseDom(dom?) {
    var clickMaskList = this.DOC.querySelectorAll('.click_mask.active');
    this.handleDeleteDom(clickMaskList);
    /* 
    TODO 
    下面的代码，会导致 CANVAS 的图片失焦，原因是动态改变了元素的大小，draw 的时候获取的还是之前的 300
    失焦的问题已经解决，是因为修改的元素不是 canvas 获取宽高的元素，但又出现了另外一个 就是 异步问题，导致
    draw 获取的值不是宽高改变后的值，而是一个随机值，貌似是因为 foreach 导致了异步...
    问题解决了，我在 CSS 的 .active 上面加了一个放大，这样就饶过了 异步问题...
     */
    // clickMaskList.forEach((item: any) => {
    //   let sib: any = item.nextElementSibling || item.nextSibling;
    //   let parent: any = item.parentElement || item.parentNode;
    //   parent.classList.add('card-big');
    //   item.classList.add('card-big');
    //   sib.classList.add('card-big');
    // });
    console.log(`${this.CONSOLE_MSG_INFO} handleCurChoseDom!`);
    return this;
  }

  /* 删除无关的DOM */
  handleDeleteDom(domList?) {
    console.log(`${this.CONSOLE_MSG_INFO} handleDeleteDom!`);
    let _that = this;
    domList.forEach((item: GlobalEventHandlers | any) => {
      item.style.display = 'none';
      item.onmouseup = null;
      item.onmousedown = null;
      // realItem.classList.add('card-delete');
    });
  }

  /* 清理之前所有的选中样式 */
  handleCleanElseClickEffect() {
    let TempList = this.DOC.querySelectorAll('.active');
    TempList.forEach((item) => {
      item.classList.remove('active');
    });
    // console.log(`${this.CONSOLE_MSG_INFO} handleCleanElseClickEffect!`, TempList);
  }

  handleDefaultEvent() {
    var _that = this;
    this.canvas = this.DOC.querySelector('.active .mask');
    this.ctx = this.canvas.getContext('2d');
    this.content = this.DOC.querySelector('.active .content');
    this.card = this.DOC.querySelector('.active .content');
    this.width = this.card.offsetWidth;
    this.height = this.card.offsetHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.brush = new Image();
    this.brush.src =
      'data:image/png;base64,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';
    this.canvas.addEventListener(
      'mousedown',
      function (e) {
        _that.mouseDown(e, 'test');
      },
      false
    );
    this.canvas.addEventListener(
      'touchstart',
      function (e) {
        _that.mouseDown(e, 'test');
      },
      false
    );
    this.canvas.addEventListener(
      'mousemove',
      function (e) {
        _that.mouseMove(e);
      },
      false
    );
    this.canvas.addEventListener(
      'touchmove',
      function (e) {
        _that.mouseMove(e);
      },
      false
    );
    this.canvas.addEventListener(
      'mouseup',
      function (e) {
        _that.mouseUp(e);
      },
      false
    );
    this.canvas.addEventListener(
      'touchend',
      function (e) {
        _that.mouseUp(e);
      },
      false
    );

    this.draw();
    // console.log(
    //   `${this.CONSOLE_MSG_INFO} handleDefaultEvent!`,
    //   this.canvas,
    //   this.ctx,
    //   this.content,
    //   this.height,
    //   this.width,
    //   this.card.offsetWidth,
    //   this.canvas.clientWidth
    // );
  }

  distanceBetween(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  }

  angleBetween(point1, point2) {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
  }

  // Only test every 'stride' pixel. 'stride'x faster
  // but might lead to inaccuracy
  getFilledInPixels(stride) {
    if (!stride || stride < 1) {
      stride = 1;
    }

    var pixels = this.ctx.getImageData(0, 0, this.width, this.height);
    var pdata = pixels.data;
    var len = pdata.length;
    var total = len / stride;
    var count = 0;
    // console.log(len);

    // Iterate over all pixels
    for (var i = 0; i < len; i += stride) {
      if (parseInt(pdata[i]) === 0) {
        count++;
      }
    }

    return Math.round((count / total) * 100);
  }

  getMouse(e: any, canvas: any) {
    console.log(`${this.CONSOLE_MSG_INFO} getMouse!`);
    var offsetX = 0;
    var offsetY = 0;
    var mx;
    var my;

    if (canvas.offsetParent !== undefined) {
      do {
        offsetX += canvas.offsetLeft;
        offsetY += canvas.offsetTop;
      } while ((canvas = canvas.offsetParent));
    }

    mx = (e.pageX || e.touches[0].clientX) - offsetX;
    my = (e.pageY || e.touches[0].clientY) - offsetY;

    return {
      x: mx,
      y: my
    };
  }

  handlePercentage(filledInPixels) {
    try {
      filledInPixels = filledInPixels || 0;
      console.log(filledInPixels + '%');
      if (filledInPixels > this.percentage) {
        if (this.canvas.parentNode) {
          this.canvas.parentNode.removeChild(this.canvas);
          this.parentAllData.handleLocalUpdateGiftsRest();
          console.log('scratch Done!');
        }
      }
    } catch (error) {
      console.log(`${this.CONSOLE_MSG_INFO} handlePercentage Error!`, error);
    }
  }

  mouseDown(e, canvas) {
    console.log(`${this.CONSOLE_MSG_INFO} mouseDown!`);
    this.isDrawing = true;
    this.lastPoint = this.getMouse(e, this.canvas);
  }

  mouseMove(e) {
    console.log(`${this.CONSOLE_MSG_INFO} mouseMove!`);

    if (!this.isDrawing) {
      return;
    }

    var currentPoint = this.getMouse(e, this.canvas);
    var dist = this.distanceBetween(this.lastPoint, currentPoint);
    var angle = this.angleBetween(this.lastPoint, currentPoint);
    var x;
    var y;

    for (var i = 0; i < dist; i++) {
      x = this.lastPoint.x + Math.sin(angle) * i - 25;
      y = this.lastPoint.y + Math.cos(angle) * i - 25;
      this.ctx.globalCompositeOperation = 'destination-out';

      // 这里需要修改
      this.ctx.drawImage(this.brush, x, y);

      // 或者下面的笔擦
      // var radius = 30;
      // var fillStyle = '#fff';
      // ctx.beginPath();
      // ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      // ctx.closePath();
      // ctx.fill();
    }

    this.lastPoint = currentPoint;
    this.handlePercentage(this.getFilledInPixels(32));
  }

  mouseUp(e) {
    this.isDrawing = false;
  }

  draw() {
    // 通过将当前状态放入栈中，保存 canvas 全部状态的方法
    // this.ctx.save();
    let img = this.DOC.querySelector('.preload_img');
    let boxDOM = this.DOC.querySelector('.active');
    let boxH = boxDOM.clientHeight || boxDOM.scrollHeight;
    let boxW = boxDOM.clientWidth || boxDOM.scrollWidth;
    this.ctx.fillStyle = '#f65736';
    this.ctx.fillRect(0, 0, this.width, this.height);
    // 这里的尺寸对应刮刮卡区域放大后的尺寸以及最小的尺寸
    this.ctx.drawImage(img, 0, 0, boxH, boxW);
    // 还原到上次的状态
    // this.ctx.restore();
    // console.log(`${this.CONSOLE_MSG_INFO} draw!`, this.height, this.width, img, this.canvas, this.ctx, boxDOM);
  }

  /* 
  TODO
  * 刮刮卡样式 
  * 刮刮卡刮时逻辑 
  * 刮刮卡生成逻辑 
  * 刮刮卡选中逻辑 
  */
}
