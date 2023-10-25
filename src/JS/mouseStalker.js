// カーソル要素を取得
const cursor = document.getElementById("cursor");

// カーソルのドットの総数
const amount = 20;

// サイン波を使用するドットの数
const sineDots = Math.floor(amount * 0.3);

// カーソルの幅
const width = 26;

// アイドル（非アクティブ）状態までのタイムアウト時間
const idleTimeout = 150;

// 最後のフレームのタイムスタンプとマウスの位置を追跡するための変数
let lastFrame = 0;
let mousePosition = { x: 0, y: 0 };

// カーソルのドットを格納する配列
let dots = [];

// タイムアウトIDとアイドルフラグ
let timeoutID;
let idle = false;

// クラス Dot: カーソルのドットを表すクラス
class Dot {
  constructor(index = 0) {
    // 各ドットのプロパティを設定
    this.index = index;
    this.anglespeed = 0.05;
    this.x = 0;
    this.y = 0;
    this.scale = 1 - 0.05 * index;
    this.range = width / 2 - width / 2 * this.scale + 2;
    this.limit = width * 0.75 * this.scale;
    this.element = document.createElement("span");
    TweenMax.set(this.element, { scale: this.scale });
    cursor.appendChild(this.element);
  }

  // ドットの位置を固定する
  lock() {
    this.lockX = this.x;
    this.lockY = this.y;
    this.angleX = Math.PI * 2 * Math.random();
    this.angleY = Math.PI * 2 * Math.random();
  }

  // ドットの描画
  draw(delta) {
    if (!idle || this.index <= sineDots) {
      TweenMax.set(this.element, { x: this.x, y: this.y });
    } else {
      this.angleX += this.anglespeed;
      this.angleY += this.anglespeed;
      this.y = this.lockY + Math.sin(this.angleY) * this.range;
      this.x = this.lockX + Math.sin(this.angleX) * this.range;
      TweenMax.set(this.element, { x: this.x, y: this.y });
    }
  }
}

// 初期化
function init() {
  // マウス移動時とタッチ移動時のイベントリスナーを追加
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("touchmove", onTouchMove);

  lastFrame += new Date();
  buildDots();
  render();
}

// アイドルタイマーを開始
function startIdleTimer() {
  timeoutID = setTimeout(goInactive, idleTimeout);
  idle = false;
}

// アイドルタイマーをリセット
function resetIdleTimer() {
  clearTimeout(timeoutID);
  startIdleTimer();
}

// アイドル状態に移行
function goInactive() {
  idle = true;
  for (let dot of dots) {
    dot.lock();
  }
}

// カーソルのドットを生成
function buildDots() {
  for (let i = 0; i < amount; i++) {
    let dot = new Dot(i);
    dots.push(dot);
  }
}

// マウス移動時のイベントハンドラ
const onMouseMove = event => {
  mousePosition.x = event.clientX - width / 2;
  mousePosition.y = event.clientY - width / 2;
  resetIdleTimer();
};

// タッチ移動時のイベントハンドラ
const onTouchMove = () => {
  mousePosition.x = event.touches[0].clientX - width / 2;
  mousePosition.y = event.touches[0].clientY - width / 2;
  resetIdleTimer();
};

// アニメーションのレンダリング
const render = timestamp => {
  const delta = timestamp - lastFrame;
  positionCursor(delta);
  lastFrame = timestamp;
  requestAnimationFrame(render);
};

// カーソルの位置を設定
const positionCursor = delta => {
  let x = mousePosition.x;
  let y = mousePosition.y;
  dots.forEach((dot, index, dots) => {
    let nextDot = dots[index + 1] || dots[0];
    dot.x = x;
    dot.y = y;
    dot.draw(delta);
    if (!idle || index <= sineDots) {
      const dx = (nextDot.x - dot.x) * 0.35;
      const dy = (nextDot.y - dot.y) * 0.35;
      x += dx;
      y += dy;
    }
  });
}


// 初期化関数を呼び出し、プログラムを開始
init();