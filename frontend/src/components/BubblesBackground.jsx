/**
 * 模糊气泡背景
 * 使用 CSS 动画的毛玻璃圆形，模仿参考项目的 canvas 气泡效果
 */
export default function BubblesBackground() {
  return (
    <div className="bubbles-bg" aria-hidden="true">
      <div className="bubble" />
      <div className="bubble" />
      <div className="bubble" />
      <div className="bubble" />
    </div>
  );
}
